import fs from "node:fs";
import path from "node:path";

export function readJson(filePath) {
  const resolved = path.resolve(filePath);
  try {
    return JSON.parse(fs.readFileSync(resolved, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read JSON ${resolved}: ${error.message}`);
  }
}

export function isCanonicalIsoUtc(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
}

export function parseSiteUrl(value, label, errors) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") errors.push(`${label}: siteUrl must use HTTPS`);
    if (url.username || url.password) errors.push(`${label}: siteUrl must not contain credentials`);
    if (url.pathname !== "/" || url.search || url.hash) {
      errors.push(`${label}: siteUrl must be an origin without path, query, or hash`);
    }
    return url;
  } catch {
    errors.push(`${label}: siteUrl must be an absolute URL`);
    return undefined;
  }
}

export function validateManifest(manifest, label = "manifest") {
  const errors = [];
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return [`${label}: root must be an object`];
  }
  if (manifest.schemaVersion !== 1) errors.push(`${label}: schemaVersion must be 1`);
  if (typeof manifest.fingerprintVersion !== "string" || !manifest.fingerprintVersion.trim()) {
    errors.push(`${label}: fingerprintVersion must be a non-empty string`);
  }

  const siteUrl = parseSiteUrl(manifest.siteUrl, label, errors);
  const generatedAtValid = isCanonicalIsoUtc(manifest.generatedAt);
  if (!generatedAtValid) errors.push(`${label}: generatedAt must be canonical ISO 8601 UTC`);
  const generatedAtMs = generatedAtValid ? Date.parse(manifest.generatedAt) : undefined;
  if (!Array.isArray(manifest.entries)) return [...errors, `${label}: entries must be an array`];

  const seen = new Set();
  let priorCanonical = "";
  for (const [index, entry] of manifest.entries.entries()) {
    const where = `${label}: entries[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`${where} must be an object`);
      continue;
    }
    if (typeof entry.path !== "string" || !entry.path.startsWith("/")) errors.push(`${where}.path must start with /`);
    if (entry.indexable !== true && entry.indexable !== false) errors.push(`${where}.indexable must be boolean`);
    if (typeof entry.contentFingerprint !== "string" || !entry.contentFingerprint.trim()) {
      errors.push(`${where}.contentFingerprint must be non-empty`);
    }

    const lastModifiedValid = isCanonicalIsoUtc(entry.lastModified);
    if (!lastModifiedValid) errors.push(`${where}.lastModified must be canonical ISO 8601 UTC`);
    if (lastModifiedValid && generatedAtMs !== undefined && Date.parse(entry.lastModified) > generatedAtMs) {
      errors.push(`${where}.lastModified must not be later than generatedAt`);
    }

    try {
      const canonical = new URL(entry.canonicalUrl);
      if (canonical.href !== entry.canonicalUrl) errors.push(`${where}.canonicalUrl must use normalized URL.href`);
      if (canonical.username || canonical.password) errors.push(`${where}.canonicalUrl must not contain credentials`);
      if (siteUrl && canonical.origin !== siteUrl.origin) errors.push(`${where}.canonicalUrl host differs from siteUrl`);
      if (canonical.hash) errors.push(`${where}.canonicalUrl must not contain a fragment`);
      if (`${canonical.pathname}${canonical.search}` !== entry.path) {
        errors.push(`${where}.path must equal canonicalUrl pathname plus search`);
      }
      if (seen.has(canonical.href)) errors.push(`${where}.canonicalUrl is duplicated`);
      seen.add(canonical.href);
      if (priorCanonical && canonical.href < priorCanonical) errors.push(`${where} is not sorted by canonicalUrl`);
      priorCanonical = canonical.href;
    } catch {
      errors.push(`${where}.canonicalUrl must be an absolute URL`);
    }
  }
  const retired = manifest.deletedUrls ?? [];
  if (!Array.isArray(retired)) errors.push(`${label}: deletedUrls must be an array`);
  else {
    const deleted = new Set();
    const active = new Set(manifest.entries.filter(e => e?.indexable).map(e => e.canonicalUrl));
    for (const value of retired) {
      try {
        const url = new URL(value);
        if (url.href !== value) errors.push(`${label}: retired URL must use normalized URL.href`);
        if (typeof value !== "string" || (siteUrl && url.origin !== siteUrl.origin) || url.username || url.password || url.hash) errors.push(`${label}: invalid retired canonical URL`);
        if (deleted.has(value)) errors.push(`${label}: duplicate retired URL`);
        if (active.has(value)) errors.push(`${label}: a retired URL is still indexable`);
        deleted.add(value);
      } catch { errors.push(`${label}: invalid retired URL`); }
    }
    if (manifest.deletedAt !== undefined) {
      if (!manifest.deletedAt || typeof manifest.deletedAt !== "object" || Array.isArray(manifest.deletedAt)) errors.push(`${label}: deletedAt must be a URL-to-time object`);
      else for (const [url, time] of Object.entries(manifest.deletedAt)) {
        if (!deleted.has(url)) errors.push(`${label}: deletedAt URL is not in deletedUrls`);
        if (!isCanonicalIsoUtc(time) || (generatedAtMs !== undefined && Date.parse(time) > generatedAtMs)) errors.push(`${label}: invalid deletion event time`);
      }
    }
  }
  return errors;
}

export function assertManifest(manifest, label = "manifest") {
  const errors = validateManifest(manifest, label);
  if (errors.length) throw new Error(errors.join("\n"));
}

export function siteOrigin(manifest) {
  return new URL(manifest.siteUrl).origin;
}

export function eligibleEntries(manifest) {
  return manifest.entries.filter((entry) => entry.indexable === true);
}

export function validateManifestPair(current, previous) {
  const errors = [];
  if (siteOrigin(current) !== siteOrigin(previous)) {
    errors.push("current and previous siteUrl origins must match");
  }
  if (Date.parse(current.generatedAt) < Date.parse(previous.generatedAt)) {
    errors.push(`current generatedAt must not move backward from ${previous.generatedAt}`);
  }
  if (current.fingerprintVersion !== previous.fingerprintVersion) {
    errors.push("current and previous fingerprintVersion differ; use an explicit rebaseline migration");
    return errors;
  }

  const previousByUrl = new Map(previous.entries.map((entry) => [entry.canonicalUrl, entry]));
  const active = new Set(eligibleEntries(current).map(entry => entry.canonicalUrl));
  const deleted = new Set(current.deletedUrls ?? []);
  const previousDeleted = new Set(previous.deletedUrls ?? []);
  for (const url of new Set([...previousDeleted, ...eligibleEntries(previous).map(entry => entry.canonicalUrl)])) {
    if (active.has(url)) continue;
    if (!deleted.has(url)) errors.push(`current: must retain deletion event for ${url}`);
    const oldTime = previous.deletedAt?.[url];
    if (oldTime && current.deletedAt?.[url] !== oldTime) {
      errors.push(`current: continuing deletion ${url} must preserve its event time`);
    } else if (!previousDeleted.has(url) && !current.deletedAt?.[url]) {
      errors.push(`current: new deletion ${url} must have an event time`);
    } else if (!previousDeleted.has(url) && Date.parse(current.deletedAt[url]) <= Date.parse(previous.generatedAt)) {
      errors.push(`current: new deletion ${url} time must advance beyond the previous production version`);
    }
  }
  for (const entry of current.entries) {
    const oldEntry = previousByUrl.get(entry.canonicalUrl);
    if (!oldEntry) continue;
    if (oldEntry.contentFingerprint === entry.contentFingerprint && oldEntry.indexable === entry.indexable) {
      if (oldEntry.lastModified !== entry.lastModified) {
        errors.push(`current: unchanged ${entry.canonicalUrl} must preserve lastModified ${oldEntry.lastModified}`);
      }
    } else if (Date.parse(entry.lastModified) <= Date.parse(oldEntry.lastModified)) {
      errors.push(`current: changed ${entry.canonicalUrl} must advance lastModified beyond ${oldEntry.lastModified}`);
    }
  }
  return errors;
}

export function assertManifestPair(current, previous) {
  const errors = validateManifestPair(current, previous);
  if (errors.length) throw new Error(errors.join("\n"));
}

export function validateCheckpointPair(current, checkpoint) {
  const errors = [];
  if (siteOrigin(current) !== siteOrigin(checkpoint)) {
    errors.push("current and checkpoint siteUrl origins must match");
  }
  if (Date.parse(current.generatedAt) < Date.parse(checkpoint.generatedAt)) {
    errors.push(`current generatedAt must not move backward from checkpoint ${checkpoint.generatedAt}`);
  }
  if (current.fingerprintVersion !== checkpoint.fingerprintVersion) {
    errors.push("current and checkpoint fingerprintVersion differ; use an explicit rebaseline migration");
    return errors;
  }

  const checkpointByUrl = new Map(checkpoint.entries.map((entry) => [entry.canonicalUrl, entry]));
  for (const entry of current.entries) {
    const oldEntry = checkpointByUrl.get(entry.canonicalUrl);
    if (!oldEntry) continue;
    const currentTime = Date.parse(entry.lastModified);
    const checkpointTime = Date.parse(oldEntry.lastModified);
    if (currentTime < checkpointTime) {
      errors.push(`current: ${entry.canonicalUrl} lastModified must not move backward from ${oldEntry.lastModified}`);
    } else if (oldEntry.contentFingerprint !== entry.contentFingerprint && currentTime === checkpointTime) {
      errors.push(`current: changed ${entry.canonicalUrl} must advance lastModified beyond ${oldEntry.lastModified}`);
    }
  }
  return errors;
}

export function assertCheckpointPair(current, checkpoint) {
  const errors = validateCheckpointPair(current, checkpoint);
  if (errors.length) throw new Error(errors.join("\n"));
}

// Compare deletion events as well as page snapshots: an added-then-retired page
// may never have appeared in the last successful notification snapshot.
export function pendingDeletionUrls(checkpoint, current) {
  const acknowledged = new Set(checkpoint?.deletedUrls ?? []);
  const active = new Set(eligibleEntries(current).map(e => e.canonicalUrl));
  return [...new Set(current.deletedUrls ?? [])].filter(url => {
    if (active.has(url)) return false;
    if (!checkpoint || !acknowledged.has(url)) return true;
    const event = current.deletedAt?.[url];
    const confirmed = checkpoint.deletedAt?.[url] ?? checkpoint.generatedAt;
    return event !== undefined && Date.parse(event) > Date.parse(confirmed);
  }).sort();
}

export function diffManifests(previous, current) {
  assertManifest(current, "current");
  if (previous !== null && previous !== undefined) { assertManifest(previous, "previous"); assertCheckpointPair(current, previous); }
  const old = new Map((previous ? eligibleEntries(previous) : []).map(e => [e.canonicalUrl, e]));
  const next = new Map(eligibleEntries(current).map(e => [e.canonicalUrl, e]));
  const result = { added: [], updated: [], deleted: [], unchanged: [] };
  for (const [url, entry] of next) {
    const prior = old.get(url);
    result[!prior ? "added" : prior.contentFingerprint !== entry.contentFingerprint || prior.lastModified !== entry.lastModified ? "updated" : "unchanged"].push(url);
  }
  result.deleted = [...new Set([...old.keys()].filter(url => !next.has(url)).concat(pendingDeletionUrls(previous, current)))];
  for (const values of Object.values(result)) values.sort();
  return result;
}

// The adapter supplies real routes, content fingerprints and trustworthy source
// dates (or generatedAt as fallback). Keep production history here, not in CI YAML.
export function prepareManifest(candidate, previous = null) {
  assertManifest(candidate, "candidate");
  if (previous !== null) {
    assertManifest(previous, "previous production");
    if (siteOrigin(candidate) !== siteOrigin(previous) || candidate.fingerprintVersion !== previous.fingerprintVersion) {
      throw new Error("site or fingerprint version changed; explicit migration required");
    }
    if (Date.parse(candidate.generatedAt) < Date.parse(previous.generatedAt)) throw new Error("production time moved backward");
  }
  const old = new Map((previous?.entries ?? []).map(entry => [entry.canonicalUrl, entry]));
  const previousDeleted = new Set(previous?.deletedUrls ?? []);
  const entries = candidate.entries.map(entry => {
    const prior = old.get(entry.canonicalUrl);
    if (!prior) {
      const deletionTime = previousDeleted.has(entry.canonicalUrl)
        ? previous.deletedAt?.[entry.canonicalUrl] ?? previous.generatedAt : undefined;
      return { ...entry, lastModified: entry.indexable && deletionTime && Date.parse(entry.lastModified) <= Date.parse(deletionTime)
        ? candidate.generatedAt : entry.lastModified };
    }
    if (prior.contentFingerprint === entry.contentFingerprint && prior.indexable === entry.indexable) return { ...entry, lastModified: prior.lastModified };
    const lastModified = Date.parse(entry.lastModified) > Date.parse(prior.lastModified) ? entry.lastModified : candidate.generatedAt;
    if (Date.parse(lastModified) <= Date.parse(prior.lastModified)) {
      throw new Error(`changed ${entry.canonicalUrl}: generation time must advance; regenerate with a later timestamp`);
    }
    return { ...entry, lastModified };
  });
  const active = new Set(entries.filter(entry => entry.indexable).map(entry => entry.canonicalUrl));
  const deleted = new Set([...previousDeleted, ...(candidate.deletedUrls ?? [])]);
  for (const entry of previous ? eligibleEntries(previous) : []) if (!active.has(entry.canonicalUrl)) deleted.add(entry.canonicalUrl);
  const deletedUrls = [...deleted].filter(url => !active.has(url)).sort();
  const deletedAt = Object.fromEntries(deletedUrls.map(url => [url,
    previous?.deletedAt?.[url] ?? (previousDeleted.has(url) ? previous.generatedAt : candidate.deletedAt?.[url] ?? candidate.generatedAt)
  ]));
  const current = { ...candidate, entries, deletedUrls, deletedAt };
  assertManifest(current);
  if (previous) assertManifestPair(current, previous);
  return current;
}
