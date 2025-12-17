import { Card, CardContent } from "@/components/ui/card";

import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  );

  return (
    <>
      <Helmet>
        <title>Rulcode Blog - Algorithm Tutorials & DSA Patterns | 200+ Free Guides</title>
        <meta
          name="description"
          content="Explore algorithms, coding tips, and system design guides. Learn DSA patterns, interview strategies, and master data structures through clear explanations and examples. Free resources for competitive programming."
        />
        <meta name="keywords" content="algorithm tutorials, DSA patterns, data structures, competitive programming, coding interview preparation, Blind 75, LeetCode solutions" />
        <link rel="canonical" href="https://rulcode.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Rulcode Blog - Algorithm Tutorials & DSA Patterns" />
        <meta property="og:description" content="Master algorithms through interactive tutorials and comprehensive guides." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rulcode.com/blog" />
        <meta property="og:image" content="https://rulcode.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rulcode Blog - Algorithm Tutorials" />
        <meta name="twitter:description" content="Master algorithms through interactive tutorials and guides." />
        <meta name="twitter:image" content="https://rulcode.com/og-image.png" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
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
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Rulcode Blogs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore algorithms, coding tips, and system design guides
            </p>
          </div>

          {/* Featured CTA Card */}

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
                <Link to="/games">Explore Games</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Blog;
