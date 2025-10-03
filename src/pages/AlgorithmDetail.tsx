import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { algorithms } from '@/data/algorithms';
import { getAlgorithmImplementation } from '@/data/algorithmImplementations';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrayVisualization } from '@/components/visualizations/ArrayVisualization';
import { LinkedListVisualization } from '@/components/visualizations/LinkedListVisualization';
import { TreeVisualization } from '@/components/visualizations/TreeVisualization';
import { GraphVisualization } from '@/components/visualizations/GraphVisualization';

const AlgorithmDetail = () => {
  const { id } = useParams();
  const algorithm = algorithms.find((a) => a.id === id);
  const implementation = getAlgorithmImplementation(id || '');
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python' | 'cpp' | 'java'>('typescript');

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Algorithm not found</h2>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const renderVisualization = () => {
    if (!implementation) {
      return (
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Visualization coming soon
          </p>
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
            <p className="text-sm text-muted-foreground">
              Visualization not available for this algorithm
            </p>
          </div>
        );
    }
  };

  return (
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
            <Badge variant="outline" className={difficultyColors[algorithm.difficulty]}>
              {algorithm.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Visualization */}
          <div className="space-y-4">
            <Card className="p-6 glass-card">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Interactive Visualization
                </h2>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-4">
                  {renderVisualization()}
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 glass-card">
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
          </div>

          {/* Right Panel - Code & Explanation */}
          <div className="space-y-4">
            <Card className="p-6 glass-card">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" />
                  Implementation
                </h3>
                
                <Tabs value={codeLanguage} onValueChange={(v) => setCodeLanguage(v as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="typescript">TypeScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="cpp">C++</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                  </TabsList>
                  
                  {implementation ? (
                    <>
                      <TabsContent value="typescript" className="mt-4">
                        <pre className="code-block overflow-x-auto">
                          <code className="text-sm">{implementation.code.typescript}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="python" className="mt-4">
                        <pre className="code-block overflow-x-auto">
                          <code className="text-sm">{implementation.code.python}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="cpp" className="mt-4">
                        <pre className="code-block overflow-x-auto">
                          <code className="text-sm">{implementation.code.cpp}</code>
                        </pre>
                      </TabsContent>
                      
                      <TabsContent value="java" className="mt-4">
                        <pre className="code-block overflow-x-auto">
                          <code className="text-sm">{implementation.code.java}</code>
                        </pre>
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
              <Card className="p-6 glass-card">
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

            {/* Practice Problems */}
            <Card className="p-6 glass-card">
              <h3 className="font-semibold mb-4">Practice Problems</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium">Practice Problem {i}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Apply this algorithm to solve real problems
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetail;
