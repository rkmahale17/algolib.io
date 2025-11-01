import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Trophy, TrendingUp, BookOpen, Building2, Tag } from 'lucide-react';
import { blind75Problems } from '@/data/blind75';
import { blind75Implementations } from '@/data/blind75Implementations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CopyCodeButton } from '@/components/CopyCodeButton';
import { ShareButton } from '@/components/ShareButton';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { CodeHighlighter } from '@/components/visualizations/shared/CodeHighlighter';

const Blind75Detail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'java' | 'cpp' | 'typescript'>('python');

  const problem = blind75Problems.find(p => p.slug === slug);
  const implementation = slug ? blind75Implementations[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Problem Not Found</h1>
          <p className="text-muted-foreground mb-8">The problem you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blind75')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blind 75
          </Button>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-500/10 text-green-500 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const languageMap = {
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    typescript: 'TypeScript'
  };

  return (
    <>
      <Helmet>
        <title>{problem.title} - Blind 75 | AlgoLib.io</title>
        <meta name="description" content={problem.description} />
        <link rel="canonical" href={`https://algolib.io/blind75/${problem.slug}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": problem.title,
            "description": problem.description,
            "url": `https://algolib.io/blind75/${problem.slug}`,
            "articleSection": problem.category,
            "proficiencyLevel": problem.difficulty,
            "author": {
              "@type": "Organization",
              "name": "AlgoLib.io"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/blind75')}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Blind 75</span>
                </Button>
                
                <Separator orientation="vertical" className="h-6" />
                
                <Breadcrumbs 
                  items={[
                    {
                      label: 'Blind 75',
                      href: '/blind75'
                    },
                    {
                      label: problem.category,
                      href: `/blind75?category=${encodeURIComponent(problem.category)}`
                    },
                    {
                      label: problem.title
                    }
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <ShareButton title={problem.title} description={problem.description} />
                {problem.leetcodeSearch && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <a href={problem.leetcodeSearch} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LeetCode
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Problem Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      #{problem.id}
                    </Badge>
                    <Badge variant="outline" className={difficultyColors[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {problem.category}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight">{problem.title}</h1>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Time: {problem.timeComplexity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Space: {problem.spaceComplexity}</span>
                </div>
              </div>

              {/* Companies */}
              {problem.companies && problem.companies.length > 0 && (
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {problem.companies.map((company) => (
                      <Badge key={company} variant="secondary">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Problem Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Problem Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
            </Card>

            {/* Solution */}
            {implementation && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Solution</h2>
                
                {/* Explanation */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Approach</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {implementation.explanation}
                  </p>
                </Card>

                {/* Code Implementation */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Implementation</h3>
                    <div className="flex items-center gap-2">
                      <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as any)}>
                        <TabsList>
                          {Object.entries(languageMap).map(([key, label]) => (
                            <TabsTrigger key={key} value={key}>
                              {label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>

                  <div className="relative">
                    <CopyCodeButton code={implementation[selectedLanguage]} />
                    <CodeHighlighter 
                      code={implementation[selectedLanguage]}
                      language={selectedLanguage}
                      highlightedLine={-1}
                    />
                  </div>
                </Card>
              </div>
            )}

            {!implementation && (
              <Card className="p-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Full implementation coming soon!
                  </p>
                  <Button asChild variant="outline">
                    <a href={problem.leetcodeSearch} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Solve on LeetCode
                    </a>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blind75Detail;
