import { BookOpen, Search, Sparkles, TrendingUp, Trophy, Coffee } from 'lucide-react';
import { algorithms, categories } from '@/data/algorithms';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredAlgorithms = algorithms.filter((algo) => {
    const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || algo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <>
      <Helmet>
        <title>AlgoLib.io - Master 72+ Algorithms with Interactive Visualizations | Free & Open Source</title>
        <meta 
          name="description" 
          content="Learn data structures and algorithms with step-by-step visualizations. 72+ algorithm animations in Python, Java, C++, TypeScript. Perfect for coding interviews, LeetCode practice, and competitive programming. 100% free and open source." 
        />
        <meta 
          name="keywords" 
          content="algorithms, data structures, leetcode, coding interviews, competitive programming, algorithm visualization, learn algorithms, DSA, python algorithms, java algorithms, c++ algorithms, typescript algorithms, free algorithm library" 
        />
        <link rel="canonical" href="https://algolib.io/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AlgoLib.io - Master 72+ Algorithms with Interactive Visualizations" />
        <meta property="og:description" content="Free open-source algorithm library with interactive visualizations. Learn DSA for coding interviews and competitive programming." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://algolib.io/" />
        <meta property="og:image" content="https://algolib.io/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AlgoLib.io - Master 72+ Algorithms Visually" />
        <meta name="twitter:description" content="Free interactive algorithm visualizations for coding interviews and competitive programming" />
        <meta name="twitter:image" content="https://algolib.io/og-image.png" />
        
        {/* Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AlgoLib.io",
            "url": "https://algolib.io",
            "description": "Free and open-source algorithm library with interactive visualizations for learning data structures and algorithms",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://algolib.io/?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
        
        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "AlgoLib.io",
            "url": "https://algolib.io",
            "logo": {
              "@type": "ImageObject",
              "url": "https://algolib.io/android-chrome-512x512.png",
              "width": 512,
              "height": 512
            },
            "sameAs": [
              "https://x.com/algolib_io",
              "https://github.com/rkmahale17/algolib.io"
            ],
            "description": "AlgoLib.io is a free and open-source algorithm library that helps developers learn and visualize algorithms with interactive animations and clean code snippets in multiple programming languages."
          })}
        </script>
        
        {/* Structured Data - ItemList for Categories */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Algorithm Categories",
            "description": "Browse algorithms by category",
            "itemListElement": categories.map((category, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Thing",
                "@id": `https://algolib.io/?category=${encodeURIComponent(category)}`,
                "name": `${category} Algorithms`,
                "description": `Learn ${category.toLowerCase()} algorithms with interactive visualizations`
              }
            }))
          })}
        </script>
        
        {/* Structured Data - CollectionPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AlgoLib.io - Algorithm Library",
            "description": "Browse 72+ algorithms with step-by-step visualizations",
            "url": "https://algolib.io",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": algorithms.length,
              "itemListElement": algorithms.slice(0, 20).map((algo, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "TechArticle",
                  "name": algo.name,
                  "description": algo.description,
                  "url": `https://algolib.io/algorithm/${algo.id}`,
                  "articleSection": algo.category,
                  "proficiencyLevel": algo.difficulty
                }
              }))
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Vertical Buy Me a Coffee Button */}
        <a
          href="https://buymeacoffee.com/jsonmaster"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 px-3 py-4 bg-[#FFDD00] text-[#000000] rounded-r-lg shadow-lg hover:bg-[#FFDD00]/90 hover:pl-4 transition-all font-medium group"
        >
          <Coffee className="w-5 h-5" />
          <span className="writing-mode-vertical text-sm whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
            Buy Me a Coffee
          </span>
        </a>

        {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Master Algorithms Visually</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text">All Competitive Algorithms</span>
              <br />
              In Your Pocket
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Step-by-step visualizations of 72+ algorithms. Watch code come to life with interactive animations.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{algorithms.length}</div>
                <div className="text-sm text-muted-foreground">Algorithms</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Free Forever</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-card border-border/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Algorithm Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlgorithms.map((algo, index) => (
            <Link key={algo.id} to={`/algorithm/${algo.id}`}>
              <Card 
                className="p-6 hover-lift cursor-pointer glass-card group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                        {algo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {algo.category}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${difficultyColors[algo.difficulty]} shrink-0`}
                    >
                      {algo.difficulty}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {algo.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-muted-foreground">Time: {algo.timeComplexity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span className="text-muted-foreground">Space: {algo.spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No algorithms found matching your search.</p>
          </div>
        )}
      </div>
      
      {/* FAQ Section */}
      <FAQ />
      
      <Footer />
    </div>
    </>
  );
};

export default Home;
