import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("app/levels/[id]/page.tsx", "utf8");
const layout = fs.readFileSync("app/levels/[id]/layout.tsx", "utf8");
const rootLayout = fs.readFileSync("app/layout.tsx", "utf8");
const site = fs.readFileSync("lib/site.ts", "utf8");
const youtubePlayer = fs.readFileSync("components/youtube-player.tsx", "utf8");

test("all level URLs use the approved shared guide structure", () => {
  assert.doesNotMatch(page, /LegacyLevelDetailPage|LevelOneDetailedGuide/);
  for (const heading of [
    "Video Walkthrough",
    "Related Jam Bus:Sandfall guides",
    "Quick Answer",
    "Level {id} at a Glance",
    "Verified Action Checkpoints",
    "Board State by Phase",
    "Overall Strategy",
    "Starting Board",
    "Step-by-Step Solution",
    "Before Each Move",
    "Where Players Get Stuck",
    "FAQ",
  ]) {
    assert.match(page, new RegExp(heading));
  }
  assert.match(page, /getVerifiedLevelGuide/);
  assert.match(page, /guide\.stats/);
  assert.match(page, /guide\.moveCheckpoints/);
  assert.match(page, /guide\.phaseMetrics/);
  assert.match(page, /overflow-x-auto/);
  assert.match(page, /<caption/);
  assert.match(page, /scope="col"/);
  assert.match(page, /hqdefault\.jpg/);
  assert.doesNotMatch(page, /maxresdefault\.jpg/);
  assert.match(youtubePlayer, /unoptimized/);
});

test("published level templates omit obsolete dates and internal labels", () => {
  const source = `${page}\n${layout}\n${rootLayout}`;
  for (const forbidden of [
    "July 2026",
    "Frame-verified",
    "Video analysis",
    "Video checkpoint",
    "Verified tap order",
    "Source transparency",
    "How This Guide Was Verified",
    "Level status",
    "Written guide checked",
    "Written steps in review",
    "@JamBusSandfallGuide",
  ]) {
    assert.doesNotMatch(source, new RegExp(forbidden, "i"));
  }
});

test("level schema uses normalized article, video, FAQ, and breadcrumb data", () => {
  for (const value of ["Article", "VideoObject", "FAQPage", "BreadcrumbList"]) {
    assert.match(layout, new RegExp(value));
  }
  assert.match(layout, /videoUploadDate/);
  assert.match(layout, /videoDurationIso/);
  assert.match(layout, /level\.videoUrl\s*&&\s*level\.videoUploadDate\s*&&\s*level\.videoDurationIso/);
  assert.match(layout, /LAST_SITE_UPDATE/);
  assert.match(site, /2026-11-04T00:00:00\+08:00/);
});
