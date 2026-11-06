#!/usr/bin/env node

import { readJson, validateManifest, validateManifestPair } from "./seo-manifest-lib.mjs";

const [currentPath, previousPath] = process.argv.slice(2);

if (!currentPath) {
  console.error("Usage: node validate-seo-manifest.mjs <current.json> [previous.json]");
  process.exit(2);
}

try {
  const current = readJson(currentPath);
  const errors = validateManifest(current, "current");
  let stableCount = 0;

  if (previousPath) {
    const previous = readJson(previousPath);
    errors.push(...validateManifest(previous, "previous"));
    if (errors.length === 0) {
      errors.push(...validateManifestPair(current, previous));
      const previousByUrl = new Map(previous.entries.map((entry) => [entry.canonicalUrl, entry]));
      for (const entry of current.entries) {
        const oldEntry = previousByUrl.get(entry.canonicalUrl);
        if (oldEntry?.contentFingerprint === entry.contentFingerprint) {
          stableCount += 1;
        }
      }
    }
  }

  if (errors.length) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exit(1);
  }

  console.log(JSON.stringify({ valid: true, entries: current.entries.length, unchangedCompared: stableCount }, null, 2));
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
}
