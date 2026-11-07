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

export const blogPosts: BlogPost[] = [];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string) {
  return category === "all" ? blogPosts : blogPosts.filter((post) => post.categoryId === category);
}
