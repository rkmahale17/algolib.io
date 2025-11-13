import { BookOpen, Coffee, Search, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { algorithms, categories } from '@/data/algorithms';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { FeaturedSection } from '@/components/FeaturedSection';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user progress and subscribe to real-time updates
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setUserProgress([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (!error && data) {
        setUserProgress(data);
      }
    };

    fetchUserProgress();

    // Subscribe to real-time updates
    if (!user) return;

    const channel = supabase
      .channel('user_progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch progress when changes occur
          fetchUserProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Read category from URL params on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Calculate progress based on real completion data
  const algorithmProgress = useMemo(() => {
    const completed = userProgress.filter(p => 
      algorithms.some(algo => algo.id === p.algorithm_id)
    ).length;
    const total = algorithms.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, [userProgress]);

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
      
      <main className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
                Master Algorithms with Interactive Visualizations
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Step-by-step visualizations of all required algorithms. Watch code come to life with interactive animations.
              </p>
            </div>
          </div>

          {/* Featured Section */}
          <FeaturedSection />

          {/* Algorithms Section */}
          <div id="algorithms" className="space-y-8 scroll-mt-20">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                Core Algorithms
              </h2>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search algorithms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === null
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Algorithm Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {filteredAlgorithms.map((algo) => (
                <Link key={algo.id} to={`/algorithm/${algo.id}`}>
                  <Card className="h-full p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 cursor-pointer group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {algo.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={difficultyColors[algo.difficulty as keyof typeof difficultyColors]}
                        >
                          {algo.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {algo.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {algo.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Time: {algo.timeComplexity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Space: {algo.spaceComplexity}
                        </Badge>
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
        </div>

        {/* FAQ and Footer */}
        <FAQ />
        <Footer />
      </main>
    </>
  );
};

export default Home;
