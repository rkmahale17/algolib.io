import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, RotateCcw, Code2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { algorithms } from '@/data/algorithms';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AlgorithmDetail = () => {
  const { id } = useParams();
  const algorithm = algorithms.find((a) => a.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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

  // Sample code - will be replaced with actual algorithm implementations
  const sampleCode = `function ${algorithm.id.replace(/-/g, '')}(arr) {
  // Implementation coming soon
  // This will contain the actual algorithm code
  
  return result;
}`;

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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Visualization
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setCurrentStep(0)}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Visualization Area - Placeholder */}
                <div className="aspect-video rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Interactive visualization coming soon
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Step {currentStep} of 10</span>
                    <span className="text-muted-foreground">Speed: 1x</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(currentStep / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Algorithm Info */}
            <Card className="p-6 glass-card">
              <div className="space-y-4">
                <h3 className="font-semibold">About this Algorithm</h3>
                <p className="text-sm text-muted-foreground">{algorithm.description}</p>
                
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
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code">
                  <Code2 className="w-4 h-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="mt-4">
                <Card className="p-6 glass-card">
                  <pre className="code-block">
                    <code className="text-sm">{sampleCode}</code>
                  </pre>
                </Card>
              </TabsContent>
              
              <TabsContent value="explanation" className="mt-4">
                <Card className="p-6 glass-card">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">How it works</h4>
                      <p className="text-sm text-muted-foreground">
                        Detailed explanation of the algorithm will be provided here, including:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground ml-4">
                        <li>Key concepts and intuition</li>
                        <li>Step-by-step walkthrough</li>
                        <li>Common use cases</li>
                        <li>Tips and tricks</li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold mb-2">When to use</h4>
                      <p className="text-sm text-muted-foreground">
                        Use cases and scenarios where this algorithm excels.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

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
