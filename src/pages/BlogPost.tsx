import "../../src/styles/blog.css";

import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getBlogPost, getRelatedPosts } from "@/data/blogPosts";

import { Badge } from "@/components/ui/badge";
import { BlogContent } from "@/components/blog/BlogContent";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/ShareButton";

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
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-background py-12 px-4 blog-post-container">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Content wrapper - Centered */}
          <div className="max-w-4xl mx-auto">
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

              {/* Share Section */}
              <div className="mt-16 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-roboto">
                    Share this article
                  </h3>
                  <ShareButton
                    title={post.title}
                    description={post.description}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
