"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchLevels } from "@/lib/data";
import { DifficultyBadge } from "./difficulty-badge";
import { levelPath } from "@/lib/level-paths";

interface LevelSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LevelSearch({ open, onOpenChange }: LevelSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = query.length > 0 ? searchLevels(query) : [];

  const handleSelect = (levelId: string) => {
    router.push(levelPath(levelId));
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Levels</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="level-dialog-search"
              name="level"
              aria-label="Search Rotate Rings levels"
              placeholder="Search by level ID, title, or tags..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {query.length > 0 && (
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {results.length > 0 ? (
                results.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleSelect(level.id)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span className="text-primary">{level.id}</span>
                          <span>{level.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                      <DifficultyBadge difficulty={level.difficulty} />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No levels found matching your search.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
