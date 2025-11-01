import { Search, Trophy, Target, TrendingUp, BookOpen } from 'lucide-react';
import { blind75Problems, blind75Categories } from '@/data/blind75';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Blind75 = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProblems = blind75Problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || problem.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const stats = {
    total: blind75Problems.length,
    easy: blind75Problems.filter(p => p.difficulty === 'easy').length,
    medium: blind75Problems.filter(p => p.difficulty === 'medium').length,
    hard: blind75Problems.filter(p => p.difficulty === 'hard').length,
  };

  return (
    <>
      <Helmet>
        <title>Blind 75 LeetCode Problems - AlgoLib.io | Interview Preparation Guide</title>
        <meta 
          name="description" 
          content="Master the Blind 75 - curated list of 75 essential LeetCode problems for coding interviews. Complete solutions in Python, Java, C++, TypeScript with detailed explanations and visualizations." 
        />
        <meta 
          name="keywords" 
          content="blind 75, leetcode, coding interview, interview preparation, leetcode problems, algorithm interview, FAANG interview" 
        />
        <link rel="canonical" href="https://algolib.io/blind75" />
        
        <meta property="og:title" content="Blind 75 LeetCode Problems - Complete Interview Guide" />
        <meta property="og:description" content="Master the 75 most important LeetCode problems for coding interviews with detailed solutions and visualizations" />
        <meta property="og:url" content="https://algolib.io/blind75" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Blind 75 LeetCode Problems",
            "description": "Curated list of 75 essential LeetCode problems for interview preparation",
            "url": "https://algolib.io/blind75",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": blind75Problems.length,
              "itemListElement": blind75Problems.map((problem, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "TechArticle",
                  "name": problem.title,
                  "description": problem.description,
                  "url": `https://algolib.io/blind75/${problem.slug}`,
                  "articleSection": problem.category,
                  "proficiencyLevel": problem.difficulty
                }
              }))
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Ace Your Interviews</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="gradient-text">Blind 75</span>
                <br />
                LeetCode Problems
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Master the 75 most important coding interview problems. Curated by top engineers at FAANG companies.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Problems</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{stats.easy}</div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">{stats.medium}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{stats.hard}</div>
                  <div className="text-sm text-muted-foreground">Hard</div>
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
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card border-border/50"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Categories</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                {blind75Categories.map((category) => (
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

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Difficulty</div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDifficulty === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(null)}
                  className="rounded-full"
                >
                  All
                </Button>
                <Button
                  variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty('easy')}
                  className="rounded-full"
                >
                  Easy
                </Button>
                <Button
                  variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty('medium')}
                  className="rounded-full"
                >
                  Medium
                </Button>
                <Button
                  variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty('hard')}
                  className="rounded-full"
                >
                  Hard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem, index) => (
              <Link key={problem.id} to={`/blind75/${problem.slug}`} target="_blank" rel="noopener noreferrer">
                <Card 
                  className="p-6 hover-lift cursor-pointer glass-card group h-full"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">#{problem.id}</span>
                          <Badge 
                            variant="outline" 
                            className={`${difficultyColors[problem.difficulty]} shrink-0 text-xs`}
                          >
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {problem.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {problem.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {problem.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-muted-foreground">Time: {problem.timeComplexity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-muted-foreground">Space: {problem.spaceComplexity}</span>
                      </div>
                    </div>

                    {problem.companies && problem.companies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {problem.companies.slice(0, 3).map((company) => (
                          <Badge key={company} variant="secondary" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No problems found matching your filters.</p>
            </div>
          )}
        </div>
      
      <Footer />
    </div>
    </>
  );
};

export default Blind75;
