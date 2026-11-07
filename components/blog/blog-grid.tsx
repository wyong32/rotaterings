"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getBlogPostsByCategory } from "@/data/blog-posts";

interface BlogGridProps {
  selectedCategory: string;
}

export function BlogGrid({ selectedCategory }: BlogGridProps) {
  const blogPosts = getBlogPostsByCategory(selectedCategory);

  if (blogPosts.length === 0) {
    return (
      <section className="container mx-auto max-w-3xl px-6 pb-16">
        <div className="border-l-4 border-primary bg-card p-7">
          <h2 className="text-2xl font-bold text-foreground">No dated updates yet</h2>
          <p className="mt-3 leading-7 text-muted-foreground">This blog is reserved for game updates and site news. Rules, strategy, level matching, and platform information are maintained in the guide library.</p>
          <Link href="/guides/" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            Browse Rotate Rings guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 pb-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              {/* Image - Clickable */}
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title - Clickable */}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
        ))}
      </div>
    </section>
  );
}
