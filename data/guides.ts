export interface GuideSection {
  heading: string;
  paragraphs: string[];
  items?: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface EvergreenGuide {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  readingTime: string;
  introduction: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  relatedLevelIds: number[];
}

export const guides: EvergreenGuide[] = [
  {
    slug: "how-to-play",
    title: "How to Play Rotate Rings: Rules, Controls, and a Reliable Solving Method",
    description: "Learn the Rotate Rings objective, how gaps and links work, how to read a board, and how to remove interlocked pieces without blocking the next move.",
    publishedAt: "2026-11-07",
    modifiedAt: "2026-11-07",
    readingTime: "8 min read",
    introduction: [
      "Rotate Rings is a spatial puzzle about releasing open rings from an interlocked arrangement. You turn a ring until its gap faces the link that holds it, then move the ring through that connection. Later boards add rails, clamps, repeated colors, and several rings that overlap in the same area. The visible gap is only one part of the answer. A valid move also needs enough rotation space and a clear exit path.",
      "The controls are simple, but the board state changes after every removal. A ring that cannot move at the start may become the next safe piece after a neighboring ring leaves. The method below gives you a repeatable way to read that change. It is more dependable than turning every visible ring until something comes loose.",
    ],
    sections: [
      {
        heading: "Understand the objective",
        paragraphs: [
          "Your objective is to remove the movable rings and connected pieces in an order that clears the board. A ring is not solved merely because its opening points toward another piece. The opening must align with the active link, and the ring must have room to travel away from that link. If a second ring crosses the route, the first ring remains blocked even when its gap looks correct.",
          "Treat every board as a set of constraints. The outer edge, nearby rings, rigid supports, and clamps limit where a piece can turn. Removing one piece reduces those constraints. The solution is therefore an order of operations: expose a useful connection, align the correct opening, remove the piece, and read the new board before continuing.",
        ],
      },
      {
        heading: "Use the controls deliberately",
        paragraphs: [
          "Press or drag on the ring you want to control, then move around its center to rotate it. Small movements are easier to judge than a fast full circle. Stop when the gap reaches the connection you intend to cross. Next, drag the ring away from the link through the opening. If the ring catches, release it and inspect the board instead of forcing the same direction.",
          "A blocked drag usually means one of three things: the gap is a few degrees off, another linked point still holds the ring, or a nearby piece occupies the exit path. Return the ring to a known position when a move fails. Leaving several rings partly rotated makes the board harder to compare with a screenshot or walkthrough.",
        ],
      },
      {
        heading: "Read the board before the first move",
        paragraphs: [
          "Start by counting the rings and locating every gap. Note which pieces touch the outside of the assembly and which pieces sit in the center. An outside ring with one visible link is often a useful opening candidate because it has more empty space around it. A center ring with several links usually depends on earlier removals.",
          "Then identify non-ring objects. A straight rail limits rotation on one side. A clamp holds a piece until its surrounding path opens. A rigid frame may remain in place while attached rings are removed. These objects are not background decoration. They define the safe direction and explain why two boards with similar colors can require different solutions.",
        ],
      },
      {
        heading: "Align the gap with the active connection",
        paragraphs: [
          "Choose one connection at a time. Follow the ring edge until you find the link that actually prevents the planned exit. Rotate by the shorter clear direction, but check that the ring will not hit another piece during the turn. When the gap reaches the link, pause and confirm that no second connection remains on the opposite side.",
          "Do not use color as the main instruction. Color helps you identify a ring in a guide, but it does not define its movement. Position, starting angle, link count, and surrounding space determine the move. If two blue rings appear, describe them by coordinates such as upper-left and lower-right rather than guessing from color alone.",
        ],
      },
      {
        heading: "Remove outside constraints before center pieces",
        paragraphs: [
          "After aligning a gap, drag the ring into open space and off its connection. Watch what becomes exposed. A newly empty area may let the neighboring ring rotate through an angle that was impossible before. Use that space immediately when it advances the same chain of connections. Jumping to an unrelated side of the board can create several half-finished paths and make the next safe move unclear.",
          "This outside-in pattern is a guide, not an absolute rule. Some levels expose a center ring early because its gap already faces an open route. Check the actual link count and travel path before applying any general strategy. The level walkthroughs record the verified order for boards where the visual shortcut is misleading.",
        ],
      },
      {
        heading: "Verify the board after every removal",
        paragraphs: [
          "Pause after each successful removal. Count the pieces that remain, note the new exposed links, and check which gaps can now rotate freely. This short verification prevents a common failure: continuing from a board that no longer matches the intended solution. On a dense board, one wrong early ring can make every later instruction appear inaccurate.",
          "Our level guides include opening coordinates, removal order, phase counts, screenshots, and a video. Use the text for the action and the image for the board state. If your game assigns a different number to the same puzzle, use the screenshot finder rather than assuming the numbered guide is wrong.",
        ],
      },
      {
        heading: "Use a consistent recovery process",
        paragraphs: [
          "When a ring rotates but will not leave, do not make several random turns. First restore its previous angle. Second, inspect the intended connection for another crossing. Third, check whether the neighboring ring should leave first. If the board has become difficult to read, restart the level and repeat only the moves you can verify.",
          "A restart is useful information, not lost progress. It confirms that the attempted order creates a blocked state. Compare the opening board with the closest published guide, then follow the first two or three moves exactly. Once those moves produce the same intermediate state, continue one verified action at a time.",
        ],
      },
    ],
    faq: [
      { question: "Which ring should I move first?", answer: "Check outside rings with one link and a clear rotation path first. Use the verified guide when several candidates meet those conditions." },
      { question: "Why does a correctly aligned gap still stay stuck?", answer: "Another link, rail, clamp, or nearby ring may still block the exit path. Alignment alone does not guarantee removal." },
      { question: "Can I solve Rotate Rings by matching colors?", answer: "No. Color identifies pieces, but position, angle, links, and available space determine the removal order." },
      { question: "What should I do after a wrong rotation?", answer: "Return the ring to its last known angle, verify the board, and restart if several pieces no longer match the opening state." },
    ],
    relatedLevelIds: [1, 2, 3, 4],
  },
  {
    slug: "tips",
    title: "Rotate Rings Tips: Removal Order, Gap Alignment, and Mistake Recovery",
    description: "Use link counts, open space, board coordinates, and phase checks to solve Rotate Rings levels with fewer failed rotations and restarts.",
    publishedAt: "2026-11-07",
    modifiedAt: "2026-11-07",
    readingTime: "8 min read",
    introduction: [
      "The hardest Rotate Rings boards are not solved by rotating faster. They are solved by choosing the piece whose removal improves the rest of the board. A ring can be movable and still be the wrong next move. The useful move opens space, reduces a link count, exposes a clamp, or gives a center piece a real exit path.",
      "These tips focus on decisions you can check on the screen. They do not depend on a color pattern or a fixed level number. Use them when you want to solve independently, and compare your state with a level guide when a board has several similar choices.",
    ],
    sections: [
      {
        heading: "Rank candidates by constraint count",
        paragraphs: [
          "Before moving anything, identify the pieces with the fewest constraints. Count visible links and note whether a rail, clamp, or ring blocks the rotation arc. A ring with one link and empty space on one side is usually easier to release than a ring with three links in the center. This ranking narrows the opening choice without relying on trial and error.",
          "Do not confuse a low link count with a guaranteed move. Trace the intended exit after the gap reaches the link. If the ring would collide with the board edge or a rigid support, keep it on the candidate list but inspect another piece first. The best opening has both a simple connection and a usable path.",
        ],
      },
      {
        heading: "Protect newly created space",
        paragraphs: [
          "Every removed ring creates an empty area. That area is a resource because adjacent pieces can rotate into it. Look at the two pieces nearest the vacancy before moving to the opposite side. One of them often becomes the next safe removal, producing a chain from the outside toward the center.",
          "A common mistake is to rotate a distant visible ring immediately after an easy removal. The distant move may consume attention without changing the blocked center. Continue the local chain while it reduces constraints. Switch areas only when the current vacancy does not improve any neighboring route.",
        ],
      },
      {
        heading: "Use coordinates instead of color alone",
        paragraphs: [
          "Describe each piece by position: upper-left, top-center, right edge, lower-center, or another stable location. Add color only as a secondary identifier. Repeated colors are common, and updates may slightly change visual effects. Coordinates remain useful when two pieces look alike or when a screenshot uses different brightness.",
          "For dense boards, divide the play area into a simple three-by-three grid. Track the starting cell, gap direction, and link count for the next candidate. This creates a small record you can compare after a move. Our level pages use the same type of position data in their board tables.",
        ],
      },
      {
        heading: "Rotate through the clear side",
        paragraphs: [
          "A gap may reach the same connection by turning clockwise or counterclockwise, but only one arc may be clear. Scan the ring circumference for collisions before dragging. Choose the direction that passes through open space and requires the smaller safe turn. Stop at the link instead of rotating past it and correcting repeatedly.",
          "When both directions appear blocked, the ring is probably not ready. Check whether a neighboring piece must leave first. Forcing a partial turn can hide the original gap direction and make the board harder to diagnose. Preserve the opening state until you have a complete rotation and exit plan.",
        ],
      },
      {
        heading: "Solve in phases and count after each phase",
        paragraphs: [
          "Group the solution into an outside phase, a release phase, and a cleanup phase. The outside phase removes simple edge pieces. The release phase uses the new space to free the central chain or expose a support. The cleanup phase removes pieces whose paths are now obvious. Not every level uses exactly three phases, but the labels make progress measurable.",
          "At each phase boundary, count the remaining pieces and verify the major board objects. If the guide says a clamp should be exposed and yours remains covered, stop before continuing. A phase check catches divergence earlier than comparing only the final board.",
        ],
      },
      {
        heading: "Recognize a dead-end state",
        paragraphs: [
          "A dead end has visible rings but no piece with both a clear rotation arc and an exit route. It often follows an attractive but premature center move. Another warning is a ring trapped between a rigid frame and the board edge after its neighboring space was used incorrectly.",
          "When you reach a dead end, identify the last removal that changed the blocked area. Restart and delay that removal until its neighboring constraint is gone. Do not try to repair every dead end with more random rotations. A clean restart preserves the evidence needed to compare orders.",
        ],
      },
      {
        heading: "Use screenshots and video for different jobs",
        paragraphs: [
          "A screenshot is best for checking state. Compare ring count, gap direction, coordinates, rails, and clamps. A video is best for confirming motion: rotation direction, drag path, and the moment a newly exposed piece becomes available. Pause only at meaningful state changes rather than copying playback time.",
          "If your board number differs from a guide, match the visual assembly first. Game updates can reorder puzzles. The screenshot finder searches published opening images, while the level library provides move counts and verified solution data for each indexed board.",
        ],
      },
    ],
    faq: [
      { question: "Is the outermost ring always first?", answer: "No. It is a strong candidate, but a rail, second link, or blocked exit can require another piece first." },
      { question: "How can I reduce unnecessary moves?", answer: "Plan the complete rotation and exit before touching a ring, then verify the new state after each removal." },
      { question: "Should frames and clamps move early?", answer: "Usually clear their attached rings first. Treat the verified board evidence as the final authority for a specific level." },
      { question: "When should I restart a level?", answer: "Restart when no ring has both a clear rotation and exit path, or when several pieces no longer match a known state." },
    ],
    relatedLevelIds: [5, 6, 7, 8],
  },
  {
    slug: "level-numbers-changed",
    title: "Why Rotate Rings Level Numbers Change and How to Find the Same Puzzle",
    description: "Find a Rotate Rings walkthrough after an update changes level order by matching the full opening board, ring coordinates, gaps, rails, and clamps.",
    publishedAt: "2026-11-07",
    modifiedAt: "2026-11-07",
    readingTime: "8 min read",
    introduction: [
      "A walkthrough can show the same Rotate Rings puzzle under a different level number. This usually means the game build and the guide source use different stage orders. A developer can insert a new puzzle, move an existing puzzle, test a different sequence, or serve a revised set to another platform. The number changes, but the visual board can remain recognizable.",
      "The reliable identifier is the opening board, not the displayed number by itself. Match the arrangement before making any move. The full ring layout, gap directions, supports, and clamps provide more evidence than color alone. This guide explains how to create a useful screenshot, search the published set, and confirm that a result is truly the same puzzle.",
    ],
    sections: [
      {
        heading: "Why numbered walkthroughs stop matching",
        paragraphs: [
          "Mobile games change over time. An update may add stages before an existing group, reorder difficulty, replace a repeated puzzle, or run a limited sequence for selected users. Store platforms can also receive builds at different times. As a result, Level 120 on one device may correspond to another number in a video recorded from an earlier build.",
          "A mismatch does not prove that either source is false. It means the number is not enough to identify the board. Check the game's current version and the opening arrangement before reporting a guide as outdated. The guide may still contain the exact solution under a different indexed number.",
        ],
      },
      {
        heading: "Capture the untouched opening board",
        paragraphs: [
          "Restart the level before taking a screenshot. Include the complete play area, every ring, visible gap, rail, clamp, and outer boundary. Avoid covering the board with a notification or a finger. A portrait screenshot of the full interface gives the finder enough context while preserving details you can inspect manually.",
          "Do not use a screenshot taken after several removals unless the opening state is unavailable. Removed pieces reduce the number of visual features, and rotated gaps can make a correct match appear different. If you already moved the board, restart first or capture both the current state and the restored opening state.",
        ],
      },
      {
        heading: "Search by the full arrangement",
        paragraphs: [
          "Open the screenshot finder and select the image from your device. Adjust the crop so the board occupies most of the preview while the outer edge remains visible. The finder compares against processed images for published guides. It does not upload your screenshot to a public gallery, and it cannot match levels that are not yet in the verified index.",
          "Review several close results when necessary. Similar boards may reuse colors while changing one ring position or support. A high visual similarity is a starting point, not final proof. Open the candidate guide and compare its recorded board facts.",
        ],
      },
      {
        heading: "Confirm a candidate with board facts",
        paragraphs: [
          "Count the rings in both images. Then compare the location of each gap, especially the outermost and center pieces. Check for straight rails, fixed frames, and clamps. Finally, compare the link count and position table on the guide page. A true match should agree on the structural features, not merely the general color distribution.",
          "Use the first verified move as a final check. The named ring should appear in the stated coordinate, and its exit should be visible. If the board matches but the first action does not, stop and examine another candidate. Do not force a guide onto a similar-looking puzzle.",
        ],
      },
      {
        heading: "What to do when no result matches",
        paragraphs: [
          "A missing result usually means the board is outside the published guide set, the crop omitted important edges, or the screenshot was taken after the opening state changed. Restore the level, capture the full board, and try again with a wider crop. Search the level library near the number shown on your device as a secondary check.",
          "If the board is still absent, keep the screenshot and note the app version, platform, and displayed level number. Those details help distinguish a new board from a reordered one. We publish a page only after its source video, images, and solution facts have been checked, so an unverified match is not added as a placeholder.",
        ],
      },
      {
        heading: "Use canonical guide links after matching",
        paragraphs: [
          "Once you find the board, save the guide URL rather than relying on the number shown in your app. Our canonical route identifies the indexed guide, while the page itself records the verified opening image and solution. If a later app update changes the displayed number again, the saved visual guide remains useful.",
          "Use the previous and next links only for the published guide sequence. They do not promise that your current game build uses the same neighboring boards. Return to the finder whenever the visual arrangement changes from the expected sequence.",
        ],
      },
      {
        heading: "Report a real mismatch clearly",
        paragraphs: [
          "When reporting an outdated guide, include the page URL, your platform, app version, displayed level number, and an untouched opening screenshot. State whether the board image differs or only the number differs. This separates a content error from normal reordering and makes the report actionable.",
          "Do not send account details, payment information, or unrelated personal data. The board image and version information are sufficient. A verified correction updates the affected page and its modification date; unrelated pages keep their existing dates.",
        ],
      },
    ],
    faq: [
      { question: "Why is my Level 100 different from the video?", answer: "Your game build may use a reordered stage list. Match the opening board instead of relying only on the number." },
      { question: "Does the screenshot finder cover every level?", answer: "No. It covers published guides with processed images and does not create matches for unverified boards." },
      { question: "What features prove two boards are the same?", answer: "Ring count, coordinates, gap directions, links, rails, frames, and clamps should all agree." },
      { question: "Should I report a number change as an error?", answer: "Report it only if the board or solution is wrong. A different displayed number can be normal after an update." },
    ],
    relatedLevelIds: [1, 4, 7, 10],
  },
  {
    slug: "where-to-play",
    title: "Where to Play Rotate Rings: Browser, App Store, and Google Play Options",
    description: "Compare the authorized browser version with the official App Store and Google Play listings, including device fit, progress storage, and version differences.",
    publishedAt: "2026-11-07",
    modifiedAt: "2026-11-07",
    readingTime: "8 min read",
    introduction: [
      "You can play Rotate Rings in this site's authorized browser embed or use the mobile listings on the App Store and Google Play. The puzzle objective is similar across these options, but the exact level order, interface, advertising, and saved progress can differ by build and platform. Choose the option that fits your device, then match a guide by the board image if its displayed number differs.",
      "This page distinguishes the game itself from the guide site. RotateRings.online is an independent fan guide. The store buttons lead to the official marketplace listings for the mobile app; they do not make this site the developer or an official download host.",
    ],
    sections: [
      {
        heading: "Play in the authorized browser embed",
        paragraphs: [
          "The homepage includes an authorized browser version of Rotate Rings. It starts without an app installation and works in a modern desktop or mobile browser. Use the Play control to load it, Fullscreen for a larger board, and Reload if the game frame stops responding. The separate Open control can launch the game source directly.",
          "Browser progress can depend on local site storage. Clearing browser data, using private mode, or switching browsers may reset that progress. If you need persistent mobile progress across ordinary sessions, compare the store app on your device. The guide pages remain separate from game progress and can be opened in another tab.",
        ],
      },
      {
        heading: "Use the Apple App Store listing on iPhone or iPad",
        paragraphs: [
          "Apple users should open the App Store link and review the current listing before installation. Check the developer name, supported operating-system version, age rating, in-app purchase information, privacy details, and recent update notes shown by Apple. Those fields can change, so the marketplace listing is the authority for current compatibility and distribution terms.",
          "An App Store build may not use the same level sequence as a browser build or an older video. If a numbered guide does not match, compare the untouched opening board. The screenshot finder is designed for that case and is more reliable than trying several nearby numbers at random.",
        ],
      },
      {
        heading: "Use Google Play on Android",
        paragraphs: [
          "Android users should use the Google Play listing linked from the download page. Confirm the package listing, developer, device compatibility, data-safety information, advertising disclosures, and update date displayed by Google. Install through Google Play rather than downloading an unknown application file from a third-party page.",
          "Android devices vary in screen size and system version. A phone can show different spacing or animation speed while preserving the same board geometry. Use ring position, gap direction, rails, and clamps when comparing screenshots. Interface scale alone does not mean the puzzle is different.",
        ],
      },
      {
        heading: "Use the documented browser source",
        paragraphs: [
          "The browser option in the comparison table opens the same authorized web build used by the homepage embed. This avoids sending players to a catalog search where several games can share similar names. Open the documented source, then compare the complete board with the guide before following a numbered solution.",
          "Third-party web listings can change or disappear. For the stable choices documented here, use the authorized homepage embed or the official Apple and Google marketplace listings. The guide site does not mirror mobile installation files.",
        ],
      },
      {
        heading: "Compare versions before following a numbered guide",
        paragraphs: [
          "Record the platform and app version when a walkthrough does not match. Restart the level and compare the full opening board with the guide image. A reordered sequence can assign a new number to an existing puzzle, while a redesigned board may need a new guide. These are different cases and should not be solved by changing the title alone.",
          "The level library includes only published, verified boards. Each page records its source video, images, coordinates, solution order, and modification date. An unavailable number is not linked as if a solution exists. This keeps the library useful even while coverage expands toward the 260-level target.",
        ],
      },
      {
        heading: "Choose the option that fits your session",
        paragraphs: [
          "Use the browser game when you want immediate play without an installation or when you are on a shared desktop. Use the mobile app when you prefer a native phone interface and local app progress. Check the store listing when device compatibility, privacy disclosures, or purchase terms matter to your decision.",
          "For walkthrough use, keep the game and guide visible side by side when possible. On desktop, open the guide in another tab or window. On mobile, pause after each removal and return to the guide image. The quick answer lists the order first, while the detailed sections explain coordinates and difficult transitions.",
        ],
      },
      {
        heading: "Know what this site provides",
        paragraphs: [
          "RotateRings.online provides an authorized browser embed, links to marketplace listings, and independently prepared guides. It does not sell the game, manage store accounts, or control app updates. Rotate Rings and its trademarks belong to their respective owner, Nebula Studio. Store availability and listing details are controlled by the platform and developer.",
          "Use the contact page to report a broken guide link or a mismatch in our published data. For installation, billing, account, or app-service issues, use the support route shown on the relevant marketplace listing. Sending the request to the responsible party produces a faster and more accurate response.",
        ],
      },
    ],
    faq: [
      { question: "Can I play Rotate Rings without installing an app?", answer: "Yes. The homepage contains an authorized browser embed that can load in a modern browser." },
      { question: "Are the App Store and Google Play buttons official game listings?", answer: "They link to the official marketplace listings. RotateRings.online remains an independent fan guide." },
      { question: "Will browser progress sync with the mobile app?", answer: "Do not assume it will. Browser storage and mobile app progress are separate unless the game explicitly provides account synchronization." },
      { question: "Why is the browser level number different from my phone?", answer: "Different builds can use different stage orders. Match the full opening board with the screenshot finder." },
    ],
    relatedLevelIds: [2, 5, 8, 10],
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
