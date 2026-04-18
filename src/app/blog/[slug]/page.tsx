import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost } from "@/data/blogPosts";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogContent } from "@/components/blog/BlogContent";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import Script from "next/script";
import "@/styles/blog.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Rulcode Blog`,
    description: post.description,
    keywords: `${post.category}, algorithms, ${post.title}, coding tutorial, DSA, competitive programming`,
    alternates: {
      canonical: `https://rulcode.com/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Rulcode Blog`,
      description: post.description,
      type: 'article',
      url: `https://rulcode.com/blog/${post.slug}`,
      images: [post.image || 'https://rulcode.com/og-image.png'],
      publishedTime: post.date,
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image || 'https://rulcode.com/og-image.png'],
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.image || 'https://rulcode.com/og-image.png',
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Rulcode.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rulcode.com/android-chrome-512x512.png"
      }
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://rulcode.com/blog/${post.slug}`
    },
    "articleSection": post.category,
    "keywords": `${post.category}, algorithms, coding tutorial`,
    "timeRequired": post.readTime
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 blog-post-container">
      <Script
        id={`blog-post-json-ld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Main Content */}
        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="font-roboto">
                {post.category}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-roboto">
              {post.title}
            </h1>

            {post.subtitle && (
              <p className="text-xl text-muted-foreground mb-6 font-roboto">
                {post.subtitle}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6 font-roboto">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Button */}
            <div className="mt-6 mb-6">
              <ShareButton
                title={post.title}
                description={post.description}
              />
            </div>

            <Separator className="mb-8" />
          </header>

          {/* Hero Image */}
          {post.image && (
            <div className="blog-image-container mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="blog-hero-image w-full h-auto rounded-xl object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <BlogContent content={post.content} />
        </article>
      </div>

      {/* Sidebars */}
      <div className="hidden xl:block fixed top-24 right-4 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <BlogSidebar category={post.category} />
      </div>

      <div className="xl:hidden container mx-auto max-w-4xl mt-12 px-4">
        <BlogSidebar category={post.category} />
      </div>
    </div>
  );
}
