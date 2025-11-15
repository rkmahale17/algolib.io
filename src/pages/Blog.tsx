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
        <title>AlgoLib Blog - Algorithm Tutorials & DSA Patterns</title>
        <meta
          name="description"
          content="Explore algorithms, coding tips, and system design guides. Learn DSA patterns, interview strategies, and master data structures through clear explanations and examples."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AlgoLib Blogs
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
