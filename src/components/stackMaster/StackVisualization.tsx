import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers } from "lucide-react";

interface StackVisualizationProps {
  stack: string[];
  getSymbolColor: (char: string) => string;
}

export const StackVisualization = ({ stack, getSymbolColor }: StackVisualizationProps) => {
  return (
    <Card className="backdrop-blur-sm bg-card/80 h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Stack (LIFO)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-3">
            Last In, First Out
          </div>
          
          <ScrollArea className="h-[400px] w-full border-2 border-primary/20 rounded-lg p-2 bg-muted/20">
            {stack.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Empty Stack
              </div>
            ) : (
              <div className="space-y-1 flex flex-col-reverse">
                {stack.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md border-2 border-primary/30 bg-card text-center font-mono text-lg font-bold transition-all duration-200 animate-in slide-in-from-top-2 ${getSymbolColor(item)}`}
                  >
                    {item}
                    {index === stack.length - 1 && (
                      <span className="ml-2 text-xs text-primary">← Top</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">Stack Size:</div>
            <div className="text-2xl font-bold text-primary">{stack.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
