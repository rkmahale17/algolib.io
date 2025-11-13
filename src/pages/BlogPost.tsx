import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBlogPost, getRelatedPosts } from '@/data/blogPosts';
import { BlogContent } from '@/components/blog/BlogContent';
import { ShareButton } from '@/components/ShareButton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import '../../src/styles/blog.css';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const relatedPosts = slug ? getRelatedPosts(slug) : [];

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const popularTags = ["Blind 75", "Two Pointers", "Dynamic Programming", "Arrays", "Graphs", "Recursion"];

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

          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            {/* Main Content - Centered */}
            <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
              <article>
                {/* Hero Image */}
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="blog-hero-image"
                  />
                )}

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
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <Separator className="mb-8" />
                </header>

                {/* Blog Content */}
                <BlogContent content={post.content} />

                {/* Share Section */}
                <div className="mt-16 pt-8 border-t border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold font-roboto">Share this article</h3>
                    <ShareButton 
                      title={post.title}
                      description={post.description}
                    />
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar - Right Side (Sticky, minimal width) */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="blog-sidebar">
                {/* Popular Tags */}
                <div className="blog-sidebar-card">
                  <h3 className="blog-sidebar-title">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-accent transition-colors font-roboto"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="blog-sidebar-card">
                    <h3 className="blog-sidebar-title">More Posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.map(relatedPost => (
                        <Link 
                          key={relatedPost.slug} 
                          to={`/blog/${relatedPost.slug}`}
                          className="block group"
                        >
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1 font-roboto">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-muted-foreground font-roboto">
                            {relatedPost.readTime}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Try Game CTA */}
                <div className="blog-sidebar-card bg-primary/5 border-primary/20">
                  <h3 className="blog-sidebar-title">Practice Your Skills</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-roboto">
                    Master algorithms through interactive games
                  </p>
                  <Link 
                    to="/games/two-pointer" 
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-all hover:shadow-md font-roboto"
                  >
                    Try Two Pointer Game
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
