import { ArrowLeft, BookOpen, Code2, ExternalLink, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
// src/pages/AlgorithmDetail.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import AlgoMetaHead from '@/services/meta.injectot';
import { ArrayVisualization } from '@/components/visualizations/ArrayVisualization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyCodeButton } from '@/components/CopyCodeButton';
import { GraphVisualization } from '@/components/visualizations/GraphVisualization';
import { LinkedListVisualization } from '@/components/visualizations/LinkedListVisualization';
import { Separator } from '@/components/ui/separator';
import { ShareButton } from '@/components/ShareButton';
import { TreeVisualization } from '@/components/visualizations/TreeVisualization';
import { algorithms } from '@/data/algorithms';
import { getAlgorithmImplementation } from '@/data/algorithmImplementations';

const AlgorithmDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const algorithm = algorithms.find((a) => a.id === id);
  const implementation = getAlgorithmImplementation(id || '');
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python' | 'cpp' | 'java'>(() => {
    return (localStorage.getItem('preferredLanguage') as any) || 'python';
  });

  // If algorithm not found - show friendly 404 and still inject meta if id present
  if (!algorithm) {
    return (
      <>
        <AlgoMetaHead id={id} />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Algorithm not found</h2>
            <p className="text-sm text-muted-foreground">
              The algorithm <code>{id}</code> could not be found.
            </p>
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const renderVisualization = () => {
    // Enhanced visualizations with static imports
    if (algorithm.id === 'two-pointers') {
      const TwoPointersVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/TwoPointersVisualization').then(m => ({ default: m.TwoPointersVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <TwoPointersVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'sliding-window') {
      const SlidingWindowVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/SlidingWindowVisualization').then(m => ({ default: m.SlidingWindowVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <SlidingWindowVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'prefix-sum') {
      const PrefixSumVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/PrefixSumVisualization').then(m => ({ default: m.PrefixSumVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <PrefixSumVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'binary-search') {
      const BinarySearchVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/BinarySearchVisualization').then(m => ({ default: m.BinarySearchVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <BinarySearchVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'kadanes-algorithm') {
      const KadanesVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/KadanesVisualization').then(m => ({ default: m.KadanesVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <KadanesVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'dutch-national-flag') {
      const DutchNationalFlagVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/DutchNationalFlagVisualization').then(m => ({ default: m.DutchNationalFlagVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <DutchNationalFlagVisualization />
        </React.Suspense>
      );
    }

    if (algorithm.id === 'merge-intervals') {
      const MergeIntervalsVisualization = React.lazy(() => 
        import('@/components/visualizations/algorithms/MergeIntervalsVisualization').then(m => ({ default: m.MergeIntervalsVisualization }))
      );
      return (
        <React.Suspense fallback={<div className="text-center py-12">Loading...</div>}>
          <MergeIntervalsVisualization />
        </React.Suspense>
      );
    }

    if (!implementation) {
      return (
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Visualization coming soon</p>
        </div>
      );
    }

    switch (implementation.visualizationType) {
      case 'array':
        return <ArrayVisualization algorithmId={algorithm.id} />;
      case 'linkedList':
        return <LinkedListVisualization algorithmId={algorithm.id} />;
      case 'tree':
        return <TreeVisualization algorithmId={algorithm.id} />;
      case 'graph':
        return <GraphVisualization algorithmId={algorithm.id} />;
      default:
        return (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Visualization not available for this algorithm</p>
          </div>
        );
    }
  };

  return (
    <div>
       {/* Dynamic SEO meta for this algorithm */}
      <AlgoMetaHead id={id} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <h1 className="text-2xl font-bold">{algorithm.name}</h1>
                  <p className="text-sm text-muted-foreground">{algorithm.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShareButton title={algorithm.name} description={algorithm.description} />
                <Badge variant="outline" className={difficultyColors[algorithm.difficulty]}>
                  {algorithm.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 overflow-x-hidden">
        {/* Mobile: Single column layout */}
        <div className="lg:hidden space-y-6">
          {/* 1. Animation */}
          <Card className="p-4 glass-card overflow-hidden">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Interactive Visualization
              </h2>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-2 overflow-x-auto">
                <div className="min-w-[280px]">
                  {renderVisualization()}
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Code Implementation */}
          <Card className="p-4 glass-card overflow-hidden">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Implementation
              </h3>
              
              <Tabs value={codeLanguage} onValueChange={(v) => {
                const lang = v as any;
                setCodeLanguage(lang);
                localStorage.setItem('preferredLanguage', lang);
              }}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
                  <TabsTrigger value="python" className="text-xs">Python</TabsTrigger>
                  <TabsTrigger value="typescript" className="text-xs">TypeScript</TabsTrigger>
                  <TabsTrigger value="cpp" className="text-xs">C++</TabsTrigger>
                  <TabsTrigger value="java" className="text-xs">Java</TabsTrigger>
                </TabsList>
                
                {implementation ? (
                  <>
                    <TabsContent value="typescript" className="mt-4">
                      <div className="relative overflow-hidden rounded-lg">
                        <CopyCodeButton code={implementation.code.typescript} />
                        <pre className="code-block overflow-x-auto whitespace-pre text-xs max-w-full block">
                          <code className="block">{implementation.code.typescript}</code>
                        </pre>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="python" className="mt-4">
                      <div className="relative overflow-hidden rounded-lg">
                        <CopyCodeButton code={implementation.code.python} />
                        <pre className="code-block overflow-x-auto whitespace-pre text-xs max-w-full block">
                          <code className="block">{implementation.code.python}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="cpp" className="mt-4">
                      <div className="relative overflow-hidden rounded-lg">
                        <CopyCodeButton code={implementation.code.cpp} />
                        <pre className="code-block overflow-x-auto whitespace-pre text-xs max-w-full block">
                          <code className="block">{implementation.code.cpp}</code>
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="java" className="mt-4">
                      <div className="relative overflow-hidden rounded-lg">
                        <CopyCodeButton code={implementation.code.java} />
                        <pre className="code-block overflow-x-auto whitespace-pre text-xs max-w-full block">
                          <code className="block">{implementation.code.java}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">Implementation coming soon</p>
                )}
              </Tabs>
            </div>
          </Card>

          {/* 3. Algorithm Overview & Complexity */}
          <Card className="p-4 glass-card overflow-hidden">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Algorithm Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                {implementation?.explanation.overview || algorithm.description}
              </p>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Time Complexity</p>
                  <Badge variant="outline" className="font-mono">
                    {algorithm.timeComplexity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Space Complexity</p>
                  <Badge variant="outline" className="font-mono">
                    {algorithm.spaceComplexity}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Steps, Use Cases & Tips */}
          {implementation && (
            <Card className="p-4 glass-card overflow-hidden">
              <Tabs defaultValue="steps">
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger value="steps" className="text-xs">Steps</TabsTrigger>
                  <TabsTrigger value="usecase" className="text-xs">Use Cases</TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs">Pro Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="steps" className="mt-4">
                  <ol className="space-y-2 list-decimal list-inside">
                    {implementation.explanation.steps.map((step, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="usecase" className="mt-4">
                  <p className="text-sm text-muted-foreground">{implementation.explanation.useCase}</p>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-4">
                  <ul className="space-y-2 list-disc list-inside">
                    {implementation.explanation.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </Card>
          )}

          {/* 5. Practice Problems */}
          {algorithm?.problems && algorithm.problems.length > 0 && (
            <Card className="p-4 glass-card overflow-hidden">
              <h3 className="font-semibold mb-4">Practice Problems</h3>
              <div className="space-y-2">
                {algorithm.problems.slice(0, 5).map((problem, i) => (
                  <a
                    key={i}
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{problem.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {problem.difficulty}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Desktop: Two column layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Visualization */}
          <div className="space-y-4 min-w-0">
            <Card className="p-4 sm:p-6 glass-card overflow-hidden">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Interactive Visualization
                </h2>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-2 sm:p-4 overflow-x-auto">
                  <div className="min-w-[280px]">
                    {renderVisualization()}
                  </div>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-4 sm:p-6 glass-card overflow-hidden">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Algorithm Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  {implementation?.explanation.overview || algorithm.description}
                </p>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Time Complexity</p>
                    <Badge variant="outline" className="font-mono">
                      {algorithm.timeComplexity}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Space Complexity</p>
                    <Badge variant="outline" className="font-mono">
                      {algorithm.spaceComplexity}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

             {algorithm?.problems && algorithm.problems.length > 0 && (
              <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                <h3 className="font-semibold mb-4">Practice Problems</h3>
                <div className="space-y-2">
                  {algorithm.problems.map((problem, i) => (
                    <a
                      key={i}
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{problem.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                          {problem.difficulty}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>
             )}
             </div>
         

          {/* Right Panel - Code & Explanation */}
          <div className="space-y-4 min-w-0">
            <Card className="p-4 sm:p-6 glass-card overflow-hidden">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Implementation
                </h3>
                
                <Tabs value={codeLanguage} onValueChange={(v) => {
                  const lang = v as any;
                  setCodeLanguage(lang);
                  localStorage.setItem('preferredLanguage', lang);
                }}>
                  <TabsList className="grid h-100 w-full grid-cols-1 sm:grid-cols-4">
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="cpp">C++</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                    <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                  </TabsList>
                  
                  {implementation ? (
                    <>
                      <TabsContent value="typescript" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.code.typescript} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.code.typescript}</code>
                          </pre>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="python" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.code.python} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.code.python}</code>
                          </pre>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="cpp" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.code.cpp} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.code.cpp}</code>
                          </pre>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="java" className="mt-4">
                        <div className="relative overflow-hidden rounded-lg">
                          <CopyCodeButton code={implementation.code.java} />
                          <pre className="code-block overflow-x-auto whitespace-pre text-xs sm:text-sm max-w-full block">
                            <code className="block">{implementation.code.java}</code>
                          </pre>
                        </div>
                      </TabsContent>
                    </>
                  ) : (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground">
                      Code implementation coming soon
                    </div>
                  )}
                </Tabs>
              </div>
            </Card>

                {implementation && (
              <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                <div className="space-y-4">
                  <h4 className="font-semibold">Step-by-Step Explanation</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    {implementation.explanation.steps.map((step, index) => (
                      <li key={index} className="ml-2">{step}</li>
                    ))}
                  </ol>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">When to Use</h4>
                    <p className="text-sm text-muted-foreground">
                      {implementation.explanation.useCase}
                    </p>
                  </div>

                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Pro Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                      {implementation.explanation.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

       
            
            </div>
            

          
          </div>
        </div>
      
      </div>
      </div>
  )
}
      

export default AlgorithmDetail;
