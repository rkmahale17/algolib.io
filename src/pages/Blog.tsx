import { Helmet } from 'react-helmet-async';
import { blogPosts } from '@/data/blogPosts';
import { BlogCard } from '@/components/blog/BlogCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Blog = () => {
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

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
            <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">
              BLOG
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AlgoLib Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore algorithms, coding tips, and system design guides
            </p>
          </div>

          {/* Featured CTA Card */}
          <Card className="mb-12 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">No credit card required, get started straight away.</h2>
              <p className="text-muted-foreground mb-6">
                Start learning algorithms interactively with AlgoLib.io
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/auth">Sign up, it's Free</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map(category => (
              <Button key={category} variant="outline" size="sm" className="rounded-full">
                {category}
              </Button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map(post => (
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
                Try AlgoLib today, it only takes a few minutes to setup
              </h2>
              <p className="text-muted-foreground mb-6">
                Interactive visualizations, games, and comprehensive algorithm guides
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
