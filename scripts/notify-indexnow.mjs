#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual, parseArgs } from "node:util";
import { readJson, diffManifests, siteOrigin } from "./seo-manifest-lib.mjs";

const endpoint = "https://api.indexnow.org/indexnow";
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Dependencies are injectable so all HTTP scenarios can be tested offline.
export async function notifyIndexNow(options, { fetch: request = globalThis.fetch, sleep: pause = sleep } = {}) {
  const { current, checkpoint = null, key, manifestUrl, send = false, production = false } = options;
  const diff = diffManifests(checkpoint, current);
  const urls = [...new Set([...diff.added, ...diff.updated, ...diff.deleted])].sort();
  const result = { mode: send ? "send" : "dry-run", urls: urls.length, batches: Math.ceil(urls.length / 10000), statuses: [] };
  if (!send) return result; // No network, key lookup or checkpoint writes in dry-run.
  if (!production) throw new Error("real submission requires a trusted successful production publication");
  if (typeof key !== "string" || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("invalid IndexNow key");
  const origin = siteOrigin(current);
  const publishedUrl = new URL(manifestUrl);
  if (publishedUrl.origin !== origin || publishedUrl.username || publishedUrl.password || publishedUrl.hash) {
    throw new Error("manifest URL must belong to the fixed production origin");
  }
  const keyLocation = `${origin}/${key}.txt`;
  const get = async url => {
    const response = await request(url, { redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (response.status !== 200) throw new Error(`production resource returned HTTP ${response.status}: ${url}`);
    return response;
  };
  const confirmCurrent = async () => {
    const response = await get(publishedUrl.href);
    if (!isDeepStrictEqual(await response.json(), current)) throw new Error("production manifest changed or does not match; retry the current published version");
  };
  await confirmCurrent();
  const keyResponse = await get(keyLocation);
  const type = keyResponse.headers.get("content-type") ?? "";
  if (!/^text\/plain(?:;|$)/i.test(type) || (await keyResponse.text()).trim() !== key) {
    throw new Error("public key file must return the correct plain-text key");
  }
  for (let offset = 0; offset < urls.length; offset += 10000) {
    const body = JSON.stringify({ host: new URL(origin).hostname, key, keyLocation, urlList: urls.slice(offset, offset + 10000) });
    for (let attempt = 0; attempt < 3; attempt++) {
      await confirmCurrent();
      let response;
      try {
        response = await request(endpoint, {
          method: "POST", redirect: "error", signal: AbortSignal.timeout(15000),
          headers: { "Content-Type": "application/json; charset=utf-8" }, body
        });
      } catch (error) {
        if (attempt === 2) throw new Error(`IndexNow network failure; checkpoint unchanged: ${error.message}`);
        await pause(1000 * 2 ** attempt);
        continue;
      }
      if (response.status === 200 || response.status === 202) {
        result.statuses.push(response.status);
        break;
      }
      if ((response.status !== 429 && response.status < 500) || attempt === 2) {
        throw new Error(`IndexNow HTTP ${response.status}; checkpoint unchanged`);
      }
      const retryAfter = response.headers.get("retry-after");
      const delay = retryAfter === null ? 1000 * 2 ** attempt
        : /^\d+$/.test(retryAfter) ? Number(retryAfter) * 1000 : Math.max(0, Date.parse(retryAfter) - Date.now());
      if (!Number.isFinite(delay) || delay > 30000) throw new Error(`IndexNow HTTP ${response.status}; retry later; checkpoint unchanged`);
      await pause(delay);
    }
  }
  await confirmCurrent();
  return { ...result, checkpoint: current };
}

export function writeCheckpoint(filePath, checkpoint) {
  const resolved = path.resolve(filePath);
  const temporary = `${resolved}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(checkpoint, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    fs.renameSync(temporary, resolved);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

async function main() {
  const { values } = parseArgs({ options: {
    current: { type: "string" }, checkpoint: { type: "string" }, "key-file": { type: "string" },
    "manifest-url": { type: "string" }, send: { type: "boolean", default: false },
    production: { type: "boolean", default: false }
  } });
  if (!values.current || !values.checkpoint) throw new Error("required: --current current.json --checkpoint receipt.json (JSON null for an explicit first run)");
  if (path.resolve(values.current).toLowerCase() === path.resolve(values.checkpoint).toLowerCase()) throw new Error("production content and notification checkpoint must be separate files");
  if (values.send && (!values["key-file"] || !values["manifest-url"])) throw new Error("sending requires --key-file and --manifest-url");
  const result = await notifyIndexNow({
    current: readJson(values.current), checkpoint: readJson(values.checkpoint),
    key: values.send ? fs.readFileSync(values["key-file"], "utf8").trim() : undefined,
    manifestUrl: values["manifest-url"], send: values.send, production: values.production
  });
  if (result.checkpoint) writeCheckpoint(values.checkpoint, result.checkpoint);
  const { checkpoint, ...summary } = result;
  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(`ERROR: ${error.message}`); process.exitCode = 1; });
}
