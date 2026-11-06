const HASH_HEX_LENGTH = 16;
const COLOR_BUCKETS = 64;
const EDGE_CELLS = 16;

function assertPixels({ data, width, height } = {}) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error("Pixel data requires positive integer width and height");
  }
  if (!data || data.length !== width * height * 4) {
    throw new Error("Pixel data length must equal width * height * 4");
  }
}

function assertDescriptor(descriptor) {
  if (
    !descriptor ||
    typeof descriptor.hash !== "string" ||
    !new RegExp(`^[0-9a-f]{${HASH_HEX_LENGTH}}$`, "i").test(descriptor.hash) ||
    !Array.isArray(descriptor.colors) ||
    descriptor.colors.length !== COLOR_BUCKETS ||
    !descriptor.colors.every(Number.isFinite) ||
    !Array.isArray(descriptor.edges) ||
    descriptor.edges.length !== EDGE_CELLS ||
    !descriptor.edges.every(Number.isFinite)
  ) {
    throw new Error("Descriptor must contain a 64-bit hash, 64 colors, and 16 edge values");
  }
}

function pixelOffset(x, y, width) {
  return (y * width + x) * 4;
}

function sampleGray(data, width, height, sampleX, sampleY, sampleWidth, sampleHeight) {
  const x = Math.min(width - 1, Math.max(0, Math.floor(((sampleX + 0.5) / sampleWidth) * width)));
  const y = Math.min(height - 1, Math.max(0, Math.floor(((sampleY + 0.5) / sampleHeight) * height)));
  const offset = pixelOffset(x, y, width);
  return data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
}

function differenceHash(data, width, height) {
  let bits = "";
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const left = sampleGray(data, width, height, x, y, 9, 8);
      const right = sampleGray(data, width, height, x + 1, y, 9, 8);
      bits += left > right ? "1" : "0";
    }
  }

  let hash = "";
  for (let index = 0; index < bits.length; index += 4) {
    hash += Number.parseInt(bits.slice(index, index + 4), 2).toString(16);
  }
  return hash;
}

function colorHistogram(data, width, height) {
  const colors = Array(COLOR_BUCKETS).fill(0);
  const pixelCount = width * height;
  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * 4;
    const red = data[offset] >> 6;
    const green = data[offset + 1] >> 6;
    const blue = data[offset + 2] >> 6;
    colors[red * 16 + green * 4 + blue] += 1;
  }
  return colors.map((count) => count / pixelCount);
}

function edgeGrid(data, width, height) {
  const sums = Array(EDGE_CELLS).fill(0);
  const counts = Array(EDGE_CELLS).fill(0);

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const left = sampleGray(data, width, height, x - 1, y, width, height);
      const right = sampleGray(data, width, height, x + 1, y, width, height);
      const top = sampleGray(data, width, height, x, y - 1, width, height);
      const bottom = sampleGray(data, width, height, x, y + 1, width, height);
      const magnitude = Math.min(1, (Math.abs(right - left) + Math.abs(bottom - top)) / 510);
      const cellX = Math.min(3, Math.floor((x / width) * 4));
      const cellY = Math.min(3, Math.floor((y / height) * 4));
      const cell = cellY * 4 + cellX;
      sums[cell] += magnitude;
      counts[cell] += 1;
    }
  }

  return sums.map((sum, index) => (counts[index] ? sum / counts[index] : 0));
}

export function descriptorFromPixels(pixels) {
  assertPixels(pixels);
  const { data, width, height } = pixels;
  return {
    hash: differenceHash(data, width, height),
    colors: colorHistogram(data, width, height),
    edges: edgeGrid(data, width, height),
  };
}

function hashSimilarity(left, right) {
  let differentBits = 0;
  for (let index = 0; index < HASH_HEX_LENGTH; index += 1) {
    let value = Number.parseInt(left[index], 16) ^ Number.parseInt(right[index], 16);
    while (value) {
      differentBits += value & 1;
      value >>= 1;
    }
  }
  return 1 - differentBits / 64;
}

function vectorSimilarity(left, right, divisor) {
  const difference = left.reduce((sum, value, index) => sum + Math.abs(value - right[index]), 0);
  return Math.max(0, Math.min(1, 1 - difference / divisor));
}

export function scoreDescriptors(query, candidate) {
  assertDescriptor(query);
  assertDescriptor(candidate);
  const score =
    0.45 * hashSimilarity(query.hash, candidate.hash) +
    0.35 * vectorSimilarity(query.colors, candidate.colors, 2) +
    0.2 * vectorSimilarity(query.edges, candidate.edges, EDGE_CELLS);
  return Math.max(0, Math.min(1, score));
}

function confidenceForScore(score) {
  if (score >= 0.82) return "strong";
  if (score >= 0.66) return "possible";
  return "low";
}

export function rankLevelMatches(queryDescriptors, index, limit = 5) {
  if (!Array.isArray(queryDescriptors) || queryDescriptors.length === 0) {
    throw new Error("At least one query descriptor is required");
  }
  if (!Array.isArray(index)) {
    throw new Error("Match index must be an array");
  }
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("Result limit must be a positive integer");
  }

  queryDescriptors.forEach(assertDescriptor);
  const bestByLevel = new Map();
  for (const entry of index) {
    if (!entry || entry.levelId === undefined) {
      throw new Error("Every match index entry requires a levelId");
    }
    assertDescriptor(entry.descriptor);
    let bestScore = 0;
    for (const query of queryDescriptors) {
      bestScore = Math.max(bestScore, scoreDescriptors(query, entry.descriptor));
    }
    const levelId = String(entry.levelId);
    bestByLevel.set(levelId, Math.max(bestByLevel.get(levelId) || 0, bestScore));
  }

  return [...bestByLevel.entries()]
    .map(([levelId, score]) => ({ levelId, score, confidence: confidenceForScore(score) }))
    .sort((left, right) => right.score - left.score || Number(left.levelId) - Number(right.levelId))
    .slice(0, limit);
}
