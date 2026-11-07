import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");
const page = read("app/page.tsx");
const game = read("components/home/online-game.tsx");
const hero = read("components/home/hero-section.tsx");
const howToPlay = read("components/home/how-to-play.tsx");
const levelHelp = read("components/home/level-help.tsx");
const storeComparison = read("components/home/store-comparison.tsx");
const levelNavigation = read("components/home/level-navigation.tsx");
const faq = read("components/home/home-faq.tsx");
const site = read("lib/site.ts");

test("homepage starts with the playable Rotate Rings experience", () => {
  assert.ok(page.indexOf("<OnlineGame") < page.indexOf("<HeroSection"));
  assert.match(game, /Play Rotate Rings Online/);
  assert.match(game, /Free Browser Puzzle/);
  assert.match(game, /Free browser puzzle/);
  assert.match(game, /No download/);
  assert.match(game, /Works on mobile/);
  assert.match(game, />\s*Play\s*</);
  assert.match(game, /Full screen/);
  assert.match(game, /Open game/);
  assert.match(game, /iframe/);
});

test("homepage uses the approved content order without a duplicate Levels 1-10 grid", () => {
  for (const component of ["OnlineGame", "HeroSection", "HowToPlay", "LevelHelp", "StoreComparison", "LevelNavigation", "HomeFaq"]) {
    assert.match(page, new RegExp(`<${component}`));
  }
  assert.doesNotMatch(levelNavigation, /LevelGrid|Rotate Rings Levels 1-/);
  assert.equal((howToPlay.match(/wrongImage:/g) ?? []).length, 4);
  assert.equal((howToPlay.match(/correctImage:/g) ?? []).length, 4);
  assert.equal((howToPlay.match(/wrongCaption:/g) ?? []).length, 4);
  assert.equal((howToPlay.match(/correctCaption:/g) ?? []).length, 4);
  assert.match(levelHelp, /Find by Screenshot/);
  assert.match(levelHelp, /100.*200/s);
  assert.match(levelNavigation, /Browse all published level guides/);
  assert.doesNotMatch(levelNavigation, /Browse all 260 level guides/);
  for (const slug of ["how-to-play", "tips", "level-numbers-changed", "where-to-play"]) {
    assert.match(levelNavigation, new RegExp(`/guides/${slug}/`));
  }
});

test("homepage explains browser play, stores, renumbering, and player questions in depth", () => {
  const sources = [game, hero, howToPlay, levelHelp, storeComparison, levelNavigation, faq].join(" ");
  const words = sources.match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
  assert.ok(words.length >= 1600, `homepage source contains only ${words.length} words`);
  assert.match(storeComparison, /App Store/);
  assert.match(storeComparison, /Google Play/);
  assert.match(storeComparison, /Browser game/);
  assert.match(storeComparison, /ONLINE_GAME_URL/);
  assert.doesNotMatch(storeComparison, /yandex\.com\/games\/search/i);
  for (const image of ["/levels/2/steps/step-1.webp", "/levels/2/steps/step-2.webp", "/levels/6/steps/step-1.webp", "/levels/6/steps/step-2.webp", "/levels/2/steps/step-3.webp"]) {
    assert.match(howToPlay, new RegExp(image.replaceAll("/", "\\/")));
  }
  assert.ok((faq.match(/question:/g) ?? []).length >= 6);
  assert.ok((faq.match(/question:/g) ?? []).length <= 8);
  assert.match(site, /store links to the official App Store and Google Play listings/);
  assert.doesNotMatch(site, /official mobile download links/);
});

test("homepage Schema describes the game, FAQs, and breadcrumb", () => {
  assert.match(page, /"@type": "VideoGame"/);
  assert.match(page, /"@type": "FAQPage"/);
  assert.match(page, /"@type": "BreadcrumbList"/);
  assert.match(page, /homeFaqs\.map/);
});

