"use client";

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { Crop, ImagePlus, LoaderCircle, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinderEmptyState } from "./finder-empty-state";
import { FinderMatch, FinderResults } from "./finder-results";
import { descriptorFromPixels, rankLevelMatches } from "@/lib/image-matcher.mjs";

type FinderState = "idle" | "reading" | "ready" | "matching" | "results" | "error";

interface MatchIndexEntry {
  levelId: string;
  source: string;
  descriptor: { hash: string; colors: number[]; edges: number[] };
}

interface MatchIndex {
  version: number;
  entries: MatchIndexEntry[];
}

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MAX_FILE_SIZE = 12 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function centeredSixByFive(width: number, height: number): CropBox {
  const ratio = 6 / 5;
  if (width / height > ratio) {
    const cropWidth = height * ratio;
    return { x: (width - cropWidth) / 2, y: 0, width: cropWidth, height };
  }
  const cropHeight = width / ratio;
  return { x: 0, y: (height - cropHeight) / 2, width, height: cropHeight };
}

function adjustedSixByFive(
  width: number,
  height: number,
  xPercent: number,
  yPercent: number,
  zoom: number,
): CropBox {
  const base = centeredSixByFive(width, height);
  const cropWidth = base.width / zoom;
  const cropHeight = base.height / zoom;
  return {
    x: ((width - cropWidth) * xPercent) / 100,
    y: ((height - cropHeight) * yPercent) / 100,
    width: cropWidth,
    height: cropHeight,
  };
}

function descriptorForCrop(bitmap: ImageBitmap, crop: CropBox) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 500;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser cannot analyze images with Canvas.");
  context.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, 600, 500);
  const image = context.getImageData(0, 0, 600, 500);
  return descriptorFromPixels(image);
}

function candidateDescriptors(bitmap: ImageBitmap, x: number, y: number, zoom: number) {
  const width = bitmap.width;
  const height = bitmap.height;
  const crops: CropBox[] = [
    { x: 0, y: 0, width, height },
    centeredSixByFive(width, height),
    adjustedSixByFive(width, height, x, y, zoom),
  ];
  if (height > width) {
    crops.splice(
      1,
      0,
      { x: 0, y: 0, width, height: height * 0.58 },
      { x: 0, y: height * 0.1, width, height: height * 0.43 },
      { x: 0, y: height * 0.13, width, height: height * 0.38 },
    );
  }
  return crops.map((crop) => descriptorForCrop(bitmap, crop));
}

export function ScreenshotFinder() {
  const inputRef = useRef<HTMLInputElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const indexRef = useRef<MatchIndex | null>(null);
  const cropControlsRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FinderState>("idle");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [results, setResults] = useState<FinderMatch[]>([]);
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(36);
  const [cropZoom, setCropZoom] = useState(1);

  const loadIndex = useCallback(async () => {
    if (indexRef.current) return indexRef.current;
    const response = await fetch("/data/level-match-index.json", { cache: "force-cache" });
    if (!response.ok) throw new Error("The level matching index is unavailable. Please try again later.");
    const index = (await response.json()) as MatchIndex;
    if (!Array.isArray(index.entries) || index.entries.length === 0) {
      throw new Error("The level matching index is empty. Please try again later.");
    }
    indexRef.current = index;
    return index;
  }, []);

  const runMatch = useCallback(async (bitmap: ImageBitmap, x = cropX, y = cropY, zoom = cropZoom) => {
    setState("matching");
    setError("");
    try {
      const index = await loadIndex();
      const descriptors = candidateDescriptors(bitmap, x, y, zoom);
      const matches = rankLevelMatches(descriptors, index.entries, 5) as FinderMatch[];
      setResults(matches);
      setState("results");
    } catch (matchError) {
      setError(matchError instanceof Error ? matchError.message : "The screenshot could not be matched.");
      setState("error");
    }
  }, [cropX, cropY, cropZoom, loadIndex]);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Use a PNG, JPEG, or WebP screenshot.");
      setState("error");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("This screenshot is larger than 12 MB. Choose a smaller image.");
      setState("error");
      return;
    }

    setState("reading");
    setError("");
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      bitmapRef.current?.close();
      bitmapRef.current = bitmap;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const objectUrl = URL.createObjectURL(file);
      objectUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);
      setFileName(file.name || "Pasted screenshot");
      setCropX(50);
      setCropY(36);
      setCropZoom(1);
      setState("ready");
      await runMatch(bitmap, 50, 36, 1);
    } catch {
      setError("This image could not be read. Try another PNG, JPEG, or WebP screenshot.");
      setState("error");
    }
  }, [runMatch]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const image = [...(event.clipboardData?.files || [])].find((file) => file.type.startsWith("image/"));
      if (image) void processFile(image);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [processFile]);

  useEffect(() => () => {
    bitmapRef.current?.close();
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void processFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const retryWithCrop = () => {
    cropControlsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const reset = () => {
    bitmapRef.current?.close();
    bitmapRef.current = null;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setPreviewUrl("");
    setFileName("");
    setResults([]);
    setError("");
    setState("idle");
    inputRef.current?.focus();
  };

  const busy = state === "reading" || state === "matching";

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInput}
        className="sr-only"
        aria-label="Choose a Rotate Rings screenshot"
      />

      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="flex min-h-48 flex-col items-center justify-center border-2 border-dashed border-primary/40 bg-primary/5 px-5 py-8 text-center"
      >
        <ImagePlus className="h-9 w-9 text-primary" />
        <h2 className="mt-3 text-xl font-bold text-foreground">Add your Rotate Rings screenshot</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Choose an image, drop it here, or paste it from your clipboard. Include the complete board when possible.
        </p>
        <Button type="button" className="mt-5" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {state === "reading" ? "Reading image" : state === "matching" ? "Finding level" : "Choose screenshot"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">PNG, JPEG, or WebP. Maximum 12 MB.</p>
      </div>

      {state === "error" ? (
        <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-4 border-destructive bg-destructive/5 px-4 py-3 text-sm text-foreground">
          <span>{error}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            Try another image
          </Button>
        </div>
      ) : null}

      {previewUrl ? (
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <figure className="overflow-hidden rounded-lg border border-border bg-[#f7e7cf]">
            {/* Blob URLs are local previews and cannot be optimized by next/image. */}
            <img src={previewUrl} alt="Selected Rotate Rings screenshot preview" className="max-h-[560px] w-full object-contain" />
            <figcaption className="border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground">{fileName}</figcaption>
          </figure>

          <div ref={cropControlsRef} className="border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <Crop className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Adjust board crop</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Change these controls when the puzzle board is not centered in your screenshot.
            </p>
            <label className="mt-5 block text-sm font-medium text-foreground">
              Horizontal position
              <input type="range" min="0" max="100" value={cropX} onChange={(event) => setCropX(Number(event.target.value))} className="mt-2 w-full accent-primary" />
            </label>
            <label className="mt-4 block text-sm font-medium text-foreground">
              Vertical position
              <input type="range" min="0" max="100" value={cropY} onChange={(event) => setCropY(Number(event.target.value))} className="mt-2 w-full accent-primary" />
            </label>
            <label className="mt-4 block text-sm font-medium text-foreground">
              Zoom
              <input type="range" min="1" max="2.5" step="0.05" value={cropZoom} onChange={(event) => setCropZoom(Number(event.target.value))} className="mt-2 w-full accent-primary" />
            </label>
            <div className="mt-6 grid gap-2">
              <Button type="button" onClick={() => bitmapRef.current && void runMatch(bitmapRef.current)} disabled={busy}>
                <Search className="h-4 w-4" />
                Match this crop
              </Button>
              <Button type="button" variant="ghost" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
                Start over
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <FinderEmptyState />
        </div>
      )}

      {state === "results" && results.length > 0 ? (
        <FinderResults results={results} onAdjustCrop={retryWithCrop} />
      ) : null}
    </div>
  );
}
