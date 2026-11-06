export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryId: "guides" | "updates" | "walkthroughs";
  date: string;
  readTime: string;
  author: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "how-to-play-rotate-rings",
    title: "How to Play Rotate Rings: Gaps, Links, and Removal Order",
    excerpt: "Learn how to read ring openings, choose a movable outside piece, and avoid rotating a blocked center ring too early.",
    category: "Guides & Tips",
    categoryId: "guides",
    date: "2026-11-06",
    readTime: "6 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/rotate-rings-level-2.webp",
    content: `<p>Rotate Rings is a spatial puzzle built around open circles and linked shapes. You drag a ring to turn its gap toward a connection, then move the ring through the opening. A ring can look aligned and still remain blocked by a second link, a rigid rail, or a clamp.</p><h2>Read the Whole Assembly First</h2><p>Count the rings and identify each visible gap. Then find the pieces on the outside edge. An outside ring with one link usually has more space to rotate than a center ring with two or more links.</p><h2>Align the Gap With the Active Link</h2><p>The gap must face the point where the ring meets the next piece. Rotate in the shorter clear direction, then drag the ring away from the connection. If it stops, return it to the last free position and check for another linked point.</p><h2>Use Removal Order, Not Color Order</h2><p>Color helps identify a piece, but it does not determine the solution. Two rings of the same color can have different positions, starting angles, and link counts. Use the position and connection data together.</p><h2>Handle Frames and Clamps Last</h2><p>Rigid supports do not rotate like open rings. Clear the rings attached to a frame before trying to move it. A clamp should remain until the piece it holds has enough space to leave.</p><h2>Confirm the New Board State</h2><p>After every removal, compare the remaining ring count and exposed links with the guide. This catches a wrong rotation before several later moves depend on it.</p>`,
  },
  {
    id: 2,
    slug: "rotate-rings-removal-order-strategy",
    title: "Rotate Rings Removal Order Strategy for Interlocked Boards",
    excerpt: "Use link counts, gap direction, and newly opened space to decide which ring should leave next.",
    category: "Guides & Tips",
    categoryId: "guides",
    date: "2026-11-06",
    readTime: "5 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/rotate-rings-level-6.webp",
    content: `<p>The difficult part of Rotate Rings is choosing the next piece. A movable ring is not always the correct ring. Removing it can leave a center piece with no usable path.</p><h2>Start With Link Count</h2><p>A ring with one linked point is a strong opening candidate. A ring with three or four links usually belongs to the final phase. The level tables list link counts so you can separate easy exits from structural pieces.</p><h2>Check Available Rotation Space</h2><p>Trace the ring's full sweep before dragging. Nearby rings, rails, and clamps can block part of the turn. Rotate only through the clear side and stop when the gap reaches the active connection.</p><h2>Protect the Exit Path</h2><p>A removed ring creates empty space. Use that space to rotate the neighboring piece. Do not spend it on a distant ring that does not open the central chain.</p><h2>Break the Board Into Phases</h2><p>Use an outside phase, a center-release phase, and a cleanup phase. At each phase boundary, count the remaining rings and verify which support or clamp has become exposed.</p><h2>Recover From a Wrong Move</h2><p>If a ring turns but cannot leave, rotate it back before moving another piece. If a removed piece causes a dead end, restart and follow the recorded removal order from the opening state.</p>`,
  },
  {
    id: 3,
    slug: "find-rotate-rings-level-by-screenshot",
    title: "How to Find a Rotate Rings Level by Screenshot",
    excerpt: "Match ring positions and frame shapes when your displayed level number does not match an online walkthrough.",
    category: "Walkthroughs",
    categoryId: "walkthroughs",
    date: "2026-11-06",
    readTime: "4 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/rotate-rings-level-10.webp",
    content: `<p>A Rotate Rings update can assign a familiar puzzle to a different number. The screenshot finder compares the board image instead of assuming every game version uses the same order.</p><h2>Capture the Opening State</h2><p>Restart the level before taking the screenshot. Keep the full ring assembly, outer edges, clamps, and rigid supports visible. An image taken after several removals has fewer identifying features.</p><h2>Use the Complete Interface</h2><p>Do not crop away the board boundary. The finder can use color distribution and edge geometry, while the guide page lets you confirm the ring count, coordinates, and starting angles.</p><h2>Review More Than the First Result</h2><p>Open the closest candidates and compare the number of rings, the position of each gap, and the presence of frames or clamps. Similar color layouts can use different connections.</p><h2>Adjust the Crop When Needed</h2><p>Move the crop controls until the ring assembly fills the preview. Run the match again, then open the best candidate and compare its opening-board table.</p><h2>Missing Matches</h2><p>The finder covers only published guides with processed images. A board outside the current 1-10 set will be added only after its source video and solution can be checked.</p>`,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  return category === "all" ? blogPosts : blogPosts.filter((post) => post.categoryId === category);
}
