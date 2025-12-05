import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Code2, ExternalLink, Lightbulb, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RichText } from "../RichText";

interface AlgorithmPreviewProps {
  algorithm: any;
}

export function AlgorithmPreview({ algorithm }: AlgorithmPreviewProps) {
  if (!algorithm || !algorithm.name) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Fill in the form to see a preview
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-500/10 text-green-500 border-green-500/20",
      intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      advance: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[difficulty?.toLowerCase()] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div className="sticky top-4">
      <Card className="border-2">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
            <Badge variant="outline" className="text-xs">
              Production View
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-4 space-y-6">
              {/* Title & Difficulty - Exact match to AlgorithmDetailNew */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{algorithm.name}</h1>
                  {algorithm.explanation?.problemStatement && (
                   <RichText content={algorithm.explanation?.problemStatement}></RichText>
                  )}
                </div>
                <div className="shrink-0">
                  {algorithm.difficulty && (
                    <Badge variant="outline" className={getDifficultyColor(algorithm.difficulty)}>
                      {algorithm.difficulty}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Examples Section - Exact match */}
              {algorithm.explanation?.io?.length > 0 && (
                <div className="space-y-4">
                  {algorithm.explanation.io.map((example: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/20">
                      <h4 className="font-semibold mb-3">Example {index + 1}:</h4>
                      <div className="space-y-2 font-mono text-sm">
                        {example.input && (
                          <div>
                            <span className="font-semibold">Input:</span>{' '}
                            <code className="bg-muted px-2 py-0.5 rounded">{example.input}</code>
                          </div>
                        )}
                        {example.output && (
                          <div>
                            <span className="font-semibold">Output:</span>{' '}
                            <code className="bg-muted px-2 py-0.5 rounded">{example.output}</code>
                          </div>
                        )}
                        {example.explanation && (
                          <div className="mt-2">
                            <span className="font-semibold">Explanation:</span>{' '}
                            <span className="text-muted-foreground whitespace-pre-line">
                              {example.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints Section - Exact match */}
              {algorithm.explanation?.constraints?.length > 0 && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h4 className="font-semibold mb-3">Constraints:</h4>
                  <ul className="space-y-1.5 font-mono text-sm">
                    {algorithm.explanation.constraints.map((constraint: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-0.5">•</span>
                        <code className="flex-1">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Note Section - Exact match */}
              {algorithm.explanation?.note && (
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm text-muted-foreground italic">{algorithm.explanation.note}</p>
                </div>
              )}

              {/* Algorithm Overview Card - Exact match */}
              <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Algorithm Overview
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {algorithm.metadata?.overview || algorithm.explanation?.problemStatement}
                  </p>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Time Complexity</p>
                      <Badge variant="outline" className="font-mono">
                        {algorithm.metadata?.timeComplexity || 'N/A'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Space Complexity</p>
                      <Badge variant="outline" className="font-mono">
                        {algorithm.metadata?.spaceComplexity || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Steps, Use Cases & Tips Card - Exact match */}
              <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                <Tabs defaultValue="steps">
                  <TabsList className="grid w-full grid-cols-3 h-auto">
                    <TabsTrigger value="steps" className="text-xs sm:text-sm">
                      Steps
                    </TabsTrigger>
                    <TabsTrigger value="usecase" className="text-xs sm:text-sm">
                      Use Cases
                    </TabsTrigger>
                    <TabsTrigger value="tips" className="text-xs sm:text-sm">
                      Pro Tips
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="steps" className="mt-4">
                    <ol className="space-y-2 list-decimal list-inside">
                      {algorithm.explanation?.steps?.map((step: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </TabsContent>

                  <TabsContent value="usecase" className="mt-4">
                    <p className="text-sm text-muted-foreground">{algorithm.explanation?.useCase}</p>
                  </TabsContent>

                  <TabsContent value="tips" className="mt-4">
                    <ul className="space-y-2 list-disc list-inside">
                      {algorithm.explanation?.tips?.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Video Tutorial Card - Exact match */}
              {algorithm.tutorials?.[0]?.url && (
                <Card className="p-4 sm:p-6 glass-card overflow-hidden max-w-5xl mx-auto">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <h3 className="font-semibold">Video Tutorial</h3>
                      </div>

                      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${
                            algorithm.tutorials[0].url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] ||
                            algorithm.tutorials[0].url
                          }`}
                          title={`${algorithm.name} Tutorial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-primary" />
                        Code Example & Logic
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {algorithm.metadata?.overview ||
                          `The implementation of ${algorithm.name} follows a systematic approach that ensures optimal performance.`}
                      </p>
                    </div>

                    <Separator />

                    {algorithm.explanation?.tips?.length > 0 && (
                      <>
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            Additional Insights & Improvements
                          </h3>
                          <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                            {algorithm.explanation.tips.map((tip: string, i: number) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )}

              {/* Practice Problems Card - Exact match */}
              {algorithm.problems_to_solve?.external?.length > 0 && (
                <Card className="p-4 sm:p-6 glass-card overflow-hidden">
                  <h3 className="font-semibold mb-4">Practice Problems</h3>
                  <div className="space-y-2">
                    {algorithm.problems_to_solve.external.map((problem: any, i: number) => (
                      <a
                        key={i}
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{problem.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">{problem.type}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
