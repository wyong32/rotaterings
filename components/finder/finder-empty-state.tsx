import { ClipboardPaste, ImagePlus, LockKeyhole } from "lucide-react";

export function FinderEmptyState() {
  return (
    <div className="grid gap-4 text-left sm:grid-cols-3">
      <div className="flex gap-3">
        <ImagePlus className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Choose or drop</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Use a clear PNG, JPEG, or WebP screenshot.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <ClipboardPaste className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Paste a screenshot</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Copy an image, then paste it anywhere on this page.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Private by design</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Your screenshot stays on this device.</p>
        </div>
      </div>
    </div>
  );
}
