import "../../src/styles/blog.css";

import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";

import { Badge } from "@/components/ui/badge";
import { BlogContent } from "@/components/blog/BlogContent";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";
import { BlogSidebar } from "@/components/blog/BlogSidebar";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug) : [];

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const popularTags = [
    "Blind 75",
    "Two Pointers",
    "Dynamic Programming",
    "Arrays",
    "Graphs",
    "Recursion",
  ];

  return (
    <>
      <Helmet>
        <title>{post.title} | AlgoLib Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={`${post.category}, algorithms, ${post.title}, coding tutorial, DSA, competitive programming`} />
        <link rel="canonical" href={`https://algolib.io/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${post.title} | AlgoLib Blog`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://algolib.io/blog/${post.slug}`} />
        <meta property="og:image" content={post.image || 'https://algolib.io/og-image.png'} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image || 'https://algolib.io/og-image.png'} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "image": post.image || 'https://algolib.io/og-image.png',
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "AlgoLib.io",
              "logo": {
                "@type": "ImageObject",
                "url": "https://algolib.io/android-chrome-512x512.png"
              }
            },
            "datePublished": post.date,
            "dateModified": post.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://algolib.io/blog/${post.slug}`
            },
            "articleSection": post.category,
            "keywords": `${post.category}, algorithms, coding tutorial`,
            "timeRequired": post.readTime
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background py-12 px-4 blog-post-container">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Main Content - Always Centered */}
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

            {/* Hero Image - Inside Content */}
            {post.image && (
              <div className="blog-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-hero-image"
                />
              </div>
            )}

            {/* Blog Content */}
            <BlogContent content={post.content} />
          </article>
        </div>

        {/* Floating Sidebar - Desktop Only (1280px+) */}
        <div className="hidden xl:block fixed top-24 right-4 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <BlogSidebar category={post.category} />
        </div>

        {/* Mobile/Tablet Sidebar - Below Content */}
        <div className="xl:hidden container mx-auto max-w-4xl mt-12 px-4">
          <BlogSidebar category={post.category} />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
