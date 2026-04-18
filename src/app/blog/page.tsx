import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Rulcode Blog - Algorithm Tutorials & DSA Patterns | 200+ Free Guides",
  description: "Explore algorithms, coding tips, and system design guides. Learn DSA patterns, interview strategies, and master data structures through clear explanations and examples. Free resources for competitive programming.",
  keywords: "algorithm tutorials, DSA patterns, data structures, competitive programming, coding interview preparation, Blind 75, LeetCode solutions",
  alternates: {
    canonical: "https://rulcode.com/blog",
  },
  openGraph: {
    title: "Rulcode Blog - Algorithm Tutorials & DSA Patterns",
    description: "Master algorithms through interactive tutorials and comprehensive guides.",
    type: "website",
    url: "https://rulcode.com/blog",
    images: ["https://rulcode.com/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rulcode Blog - Algorithm Tutorials",
    description: "Master algorithms through interactive tutorials and guides.",
    images: ["https://rulcode.com/og-image.png"],
  },
};

export default function BlogPage() {
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Rulcode Blog",
    "description": "Algorithm tutorials, DSA patterns, and competitive programming guides",
    "url": "https://rulcode.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Rulcode.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://rulcode.com/android-chrome-512x512.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <Script
        id="blog-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Rulcode Blogs
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore algorithms, coding tips, and system design guides
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              description={post.description}
              date={post.date}
              readTime={post.readTime}
              category={post.category}
              thumbnail={post.thumbnail}
            />
          ))}
        </div>

        {/* Bottom CTA Card */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Play Algo Games for learning algo in fun way!
            </h2>
            <p className="text-muted-foreground mb-6">
              Interactive visualizations, games, and comprehensive algorithm
              guides
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/games">Explore Games</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
