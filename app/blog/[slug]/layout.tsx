import { Metadata } from 'next';
import { getBlogPostBySlug, blogPosts } from '@/data/blog-posts';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { canonical, SITE_NAME, SITE_URL } from '@/lib/site';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found'
    };
  }

  const url = canonical(`/blog/${slug}/`);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: ["Rotate Rings", post.category, "guide", "walkthrough", "tips", "bus route puzzle"],
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      url: url,
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ],
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image]
    },
    alternates: {
      canonical: url
    }
  };
}

export default async function BlogPostLayout({ params, children }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": `${SITE_URL}${post.image}`,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical(`/blog/${slug}/`)
    },
    "articleSection": post.category,
    "keywords": "Rotate Rings, bus route puzzle, sand matching, guide, walkthrough, tips"
  };

  return (
    <>
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
