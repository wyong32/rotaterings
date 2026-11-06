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
    title: "How to Play Rotate Rings: Routes, Sand Colors, and Parking",
    excerpt: "Learn the three checks that matter before you tap a bus: route direction, exposed sand color, and available parking.",
    category: "Guides & Tips",
    categoryId: "guides",
    date: "2026-11-02",
    readTime: "6 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/gameplay-1.webp",
    content: `<p>Rotate Rings combines a vehicle-routing puzzle with color matching. The upper panel contains layered colored sand. The lower panel contains buses that point in different directions. A bus must have a clear route to the road before it can leave the field.</p><h2>Check Three Things Before Every Tap</h2><p>First, trace the bus direction to the edge of the vehicle field. Second, confirm that sand of the same color is currently exposed. Third, check the parking row. A bus that cannot collect sand may remain parked and use space needed by the next color.</p><h2>Why Route Order Matters</h2><p>Short buses often block long buses. Moving the nearest vehicle is not always correct. Prefer a move that both collects exposed sand and opens a route for another vehicle.</p><h2>Use Parking as a Limit</h2><p>Keep one position open when possible. That reserve space lets a newly exposed color enter without forcing a restart. An unlocked parking upgrade increases capacity, but it does not remove the need to manage the queue.</p><h2>When to Restart</h2><p>Restart when the parking row is full and none of the parked colors matches the exposed sand. Continuing from that state usually cannot restore the verified route order.</p>`,
  },
  {
    id: 2,
    slug: "rotate-rings-release-order-strategy",
    title: "Rotate Rings Parking Strategy: Avoiding a Full Queue",
    excerpt: "A practical guide to parking capacity, repeated colors, and the route choices that cause late-level locks.",
    category: "Guides & Tips",
    categoryId: "guides",
    date: "2026-11-02",
    readTime: "5 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/gameplay-2.webp",
    content: `<p>Parking is the main constraint in Rotate Rings. A bus reaches the road quickly, but it may stay there until enough matching sand is available. Several unfinished colors can therefore fill the entire row.</p><h2>Do Not Queue Every Visible Color</h2><p>A visible bus is not automatically useful. If its matching sand is covered by another layer, the bus will wait. Release colors that can collect now or that the verified solution uses to open a required route.</p><h2>Repeated Colors Need Separate Phases</h2><p>Boards such as the rose bouquet and pizza contain repeated red or yellow regions. Do not send every bus of that color during the first region. Some vehicles belong to later layers.</p><h2>Parking Upgrades Are Still Limited</h2><p>Some levels increase the number of parking positions. Keep at least one of the new spaces open. Filling every upgraded position creates the same lock at a later point.</p><h2>Compare Board States</h2><p>Pause the walkthrough after a major sand layer clears. Compare both the remaining picture and the buses still in the field. Matching only one of those states is not enough.</p>`,
  },
  {
    id: 3,
    slug: "find-rotate-rings-level-by-screenshot",
    title: "How to Find a Rotate Rings Level by Screenshot",
    excerpt: "Game updates can change level numbers. Match the opening board image to the guide library instead.",
    category: "Walkthroughs",
    categoryId: "walkthroughs",
    date: "2026-11-02",
    readTime: "4 min read",
    author: "RotateRings.online Guide Team",
    image: "/images/store/gameplay-3.webp",
    content: `<p>A numbered Rotate Rings level may show a different picture after an update. The screenshot finder compares the visual board instead of assuming that every version uses the same number.</p><h2>Capture the Opening Board</h2><p>Reset the level and capture the full sand picture before any bus moves. Keep the picture panel visible and avoid covering it with another menu.</p><h2>Use the Board, Not the Parking Row</h2><p>The finder focuses on the 600 by 500 board covers in the guide library. The bus arrangement can still help you confirm a result, but the sand picture is the strongest visual signal.</p><h2>Check the Top Matches</h2><p>Open the closest result and compare the colors, outline, and major picture features. Then compare the first full-interface screenshot on the level page.</p><h2>When No Match Appears</h2><p>The current library covers published source videos only. A missing match may be a later level that has not yet been added. The playlist monitor checks for new numbered walkthroughs each week after the existing queue is complete.</p>`,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  return category === "all" ? blogPosts : blogPosts.filter((post) => post.categoryId === category);
}
