"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Link2, Check, Send, MessageCircle, Mail, Facebook, Twitter, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import { getBlogPostBySlug, blogPosts } from "@/data/blog-posts";
import { ArticleContentWithAds } from "@/components/ads/article-content-with-ads";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Get the blog post data
  const post = getBlogPostBySlug(slug);

  // If post not found, show 404
  if (!post) {
    notFound();
  }

  // Set mounted state on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getShareLinks = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const postTitle = post.title;

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(postTitle + ' ' + currentUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(postTitle)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(postTitle)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(postTitle)}`,
      email: `mailto:?subject=${encodeURIComponent(postTitle)}&body=${encodeURIComponent(currentUrl)}`,
    };
  };

  // Get related posts (exclude current post)
  const relatedPosts = blogPosts
    .filter(p => p.slug !== slug && p.categoryId === post.categoryId)
    .slice(0, 2);

  return (
    <div>
      {/* Header */}
      <div className="container mx-auto px-6 pt-10 pb-6 max-w-4xl">
        <Link href="/blog">
          <Button variant="outline" className="border-2 hover:bg-accent mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Category Badge */}
        <div className="mb-5">
          <span className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>By {post.author}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-6 mb-14 max-w-4xl">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-6 pb-16 max-w-4xl">
        <ArticleContentWithAds
          content={post.content}
          className="prose prose-xl max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:leading-tight
            prose-p:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-li:text-lg prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:mb-3"
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.8'
          }}
        />

        {/* Share Section - Only render on client side to avoid hydration mismatch */}
        {isMounted && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="text-center">
              <h3 className="text-center text-gray-700 text-sm sm:text-base font-medium mb-2 sm:mb-3 px-2">Share this Guide with your friends:</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center items-center px-2">
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200 hover:scale-110 shadow-md relative"
                  title={copied ? 'Copied!' : 'Copy link'}
                >
                  {copied ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  {copied && (
                    <span className="absolute -top-7 sm:-top-8 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>

                {/* Facebook */}
                <a
                  href={getShareLinks().facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on Facebook"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                </a>

                {/* X (Twitter) */}
                <a
                  href={getShareLinks().twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on X"
                >
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                </a>

                {/* WhatsApp */}
                <a
                  href={getShareLinks().whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                </a>

                {/* Telegram */}
                <a
                  href={getShareLinks().telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0088cc] hover:bg-[#0077b3] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on Telegram"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                {/* LINE */}
                <a
                  href={getShareLinks().line}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#00B900] hover:bg-[#009900] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on LINE"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={getShareLinks().linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                </a>

                {/* Reddit */}
                <a
                  href={getShareLinks().reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FF4500] hover:bg-[#e03d00] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on Reddit"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </a>

                {/* Pinterest */}
                <a
                  href={getShareLinks().pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E60023] hover:bg-[#c50020] text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share on Pinterest"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </a>

                {/* Email */}
                <a
                  href={getShareLinks().email}
                  className="inline-flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110 shadow-md"
                  title="Share via Email"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-40">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-primary font-semibold">{relatedPost.category}</span>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1">
                      {relatedPost.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </div>
  );
}
