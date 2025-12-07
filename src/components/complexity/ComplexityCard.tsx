
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Code2 } from "lucide-react";
import ComplexityGraph from './ComplexityGraph';
import { ComplexityType, generateComplexityData, complexityConfig } from '@/utils/complexityData';

interface ComplexityCardProps {
  type: ComplexityType;
  animationComponent: React.ReactNode;
  exampleCode: string;
  n: number;
  onNChange: (value: number) => void;
}

const ComplexityCard: React.FC<ComplexityCardProps> = ({ type, animationComponent, exampleCode, n, onNChange }) => {
  const config = complexityConfig[type];
  const data = generateComplexityData(n, type);
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  return (
    <Card className="w-full overflow-hidden border-l-4" style={{ borderLeftColor: config.color }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              {config.title}
              <Badge variant="outline" className="font-mono" style={{ borderColor: config.color, color: config.color }}>
                {type}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 text-base">{config.description}</CardDescription>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground bg-muted/20 p-3 rounded-md">
            {config.detailedDescription}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Common Examples List */}
        <div className="bg-background/50 border rounded-lg p-4">
             <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                Common Algo Examples
             </h4>
             <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                 {config.examples.map((ex, i) => (
                     <li key={i} className="flex items-start gap-2 text-muted-foreground p-2 rounded hover:bg-muted/40 transition-colors">
                         <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                             {i + 1}
                         </span>
                         {ex}
                     </li>
                 ))}
             </ul>
        </div>
        
        {/* Visualization & Graph Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Animation Area */}
          <div className="flex flex-col gap-4 min-h-[200px] justify-center">
             <div className="text-sm font-medium text-muted-foreground mb-2">Visual Representation (N = {n})</div>
             <div className="bg-muted/10 rounded-lg p-4 border flex items-center justify-center min-h-[240px] relative overflow-hidden">
                {animationComponent}
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Input Size (N)</span>
                    <span>{n}</span>
                </div>
                <Slider 
                    value={[n]} 
                    min={1} 
                    max={50} // Use smaller max for visual animations to keep them readable? Or scalable?
                    // NOTE: Graph uses 'n' for X-axis range/rendering. Visuals might need clamping.
                    onValueChange={(val) => onNChange(val[0])} 
                    step={1}
                />
             </div>
          </div>

          {/* Graph Area */}
          <div className="flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-2">Growth Rate</div>
            <ComplexityGraph data={data} color={config.color} />
          </div>
        </div>

        {/* Code Snippet */}
        <Collapsible open={isCodeOpen} onOpenChange={setIsCodeOpen} className="border rounded-md bg-muted/20">
            <CollapsibleTrigger className="flex items-center gap-2 p-3 w-full hover:bg-muted/30 transition-colors text-sm font-medium">
                <Code2 className="w-4 h-4" />
                <span>Example Code</span>
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isCodeOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="p-4 pt-0 font-mono text-xs overflow-x-auto">
                    <pre className="bg-background/80 p-3 rounded border">
                        <code>{exampleCode}</code>
                    </pre>
                </div>
            </CollapsibleContent>
        </Collapsible>

      </CardContent>
    </Card>
  );
};

export default ComplexityCard;
