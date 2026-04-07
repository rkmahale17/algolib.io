import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { Info, CheckCircle2, ArrowRight } from 'lucide-react';

interface Step {
  words: string[];
  adj: Record<string, string[]>;
  inDegree: Record<string, number>;
  queue: string[];
  result: string;
  count: number;
  i: number | null;
  j: number | null;
  word1: string | null;
  word2: string | null;
  currentChar: string | null;
  currentLoop: string;
  message: string;
  lineNumber: number;
  isMatch?: boolean;
}

export const AlienDictionaryVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function alienOrder(words: string[]): string {
  const adj: Map<string, string[]> = new Map();
  const inDegree: Map<string, number> = new Map();

  for (const word of words) {
    for (const char of word) {
      inDegree.set(char, 0);
    }
  }

  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];
    const minLength = Math.min(word1.length, word2.length);

    for (let j = 0; j < minLength; j++) {
      if (word1[j] !== word2[j]) {
        if (!adj.has(word1[j])) {
          adj.set(word1[j], []);
        }

        if (!adj.get(word1[j])!.includes(word2[j])) {
          adj.get(word1[j])!.push(word2[j]);
          inDegree.set(word2[j], inDegree.get(word2[j])! + 1);
        }
        break;
      }
      if (j === minLength - 1 && word1.length > word2.length) {
        return "";
      }
    }
  }

  const queue: string[] = [];
  for (const [char, degree] of inDegree) {
    if (degree === 0) {
      queue.push(char);
    }
  }

  let result = "";
  let count = 0;

  while (queue.length > 0) {
    const char = queue.shift()!;
    result += char;
    count++;

    if (adj.has(char)) {
      for (const neighbor of adj.get(char)!) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  if (count !== inDegree.size) {
    return "";
  }

  return result;
}`;

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    const words = ["wrt", "wrf", "er", "ett", "rftt"];
    
    const adj: Map<string, string[]> = new Map();
    const inDegree: Map<string, number> = new Map();
    const queue: string[] = [];
    let result = "";
    let count = 0;

    const snap = (
      msg: string, line: number, isMatch: boolean = false, 
      i: number | null = null, j: number | null = null, 
      word1: string | null = null, word2: string | null = null,
      currentChar: string | null = null, currentLoop: string = ""
    ) => {
      s.push({
        words: [...words],
        adj: Object.fromEntries(adj),
        inDegree: Object.fromEntries(inDegree),
        queue: [...queue],
        result,
        count,
        i, j, word1, word2, currentChar, currentLoop,
        message: msg,
        lineNumber: line,
        isMatch
      });
    };

    snap("Initialize adjacency list (adj) and inDegree Map.", 2, false);

    snap("Iterate over all words to initialize unique characters in inDegree Map to 0.", 5, false, null, null, null, null, null, "init");
    for (const word of words) {
      for (const char of word) {
        if (!inDegree.has(char)) {
            inDegree.set(char, 0);
        }
      }
      snap(`Setup tracking for unique letters found in word "${word}".`, 7, false, null, null, null, null, null, "init");
    }

    snap("Start comparing adjacent words to construct the directed graph edges.", 11, false, null, null, null, null, null, "build");
    for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];
        const minLength = Math.min(word1.length, word2.length);
        
        snap(`Comparing adjacent words: "${word1}" and "${word2}"`, 12, false, i, null, word1, word2, null, "build");

        for (let j = 0; j < minLength; j++) {
            snap(`Compare characters at index ${j}: '${word1[j]}' vs '${word2[j]}'`, 16, false, i, j, word1, word2, null, "build");
            
            if (word1[j] !== word2[j]) {
                const c1 = word1[j];
                const c2 = word2[j];
                
                if (!adj.has(c1)) {
                    adj.set(c1, []);
                    snap(`First time seeing '${c1}' as a source. Initializing its adjacency row.`, 19, false, i, j, word1, word2, c1, "build");
                }
                
                if (!adj.get(c1)!.includes(c2)) {
                    adj.get(c1)!.push(c2);
                    inDegree.set(c2, inDegree.get(c2)! + 1);
                    snap(`Found a difference! Add directed edge ${c1} -> ${c2} to Graph and increment inDegree for ${c2}.`, 24, true, i, j, word1, word2, c1, "build");
                } else {
                    snap(`Mismatch ${c1} != ${c2} found, but edge ${c1} -> ${c2} already exists! Skipping edge.`, 22, false, i, j, word1, word2, c1, "build");
                }
                
                snap(`Words resolved. Break character loop and proceed to next adjacent word pair.`, 26, false, i, j, word1, word2, null, "build");
                break;
            }
        }
    }

    snap("Identify characters completely ready with NO dependencies (InDegree === 0).", 34, false, null, null, null, null, null, "bfs");
    for (const [char, degree] of inDegree.entries()) {
        if (degree === 0) {
            queue.push(char);
            snap(`Character '${char}' has inDegree 0. Pushing to roots Queue.`, 37, true, null, null, null, null, char, "bfs");
        }
    }

    snap("Commence Topological Sort using BFS processing roots.", 41, false, null, null, null, null, null, "bfs");

    while (queue.length > 0) {
        snap(`Queue has elements: [${queue.join(', ')}]`, 44, false, null, null, null, null, queue[0], "bfs");
        
        const char = queue.shift()!;
        result += char;
        count++;
        
        snap(`Shifted '${char}' from queue. Appended to Result.`, 46, true, null, null, null, null, char, "bfs");
        
        if (adj.has(char)) {
            const neighbors = adj.get(char)!;
            snap(`Fetching downstream edges starting from '${char}': [${neighbors.join(', ')}]`, 49, false, null, null, null, null, char, "bfs");
            for (const neighbor of neighbors) {
                inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
                snap(`Decremented InDegree constraint on '${neighbor}'. Remaining: ${inDegree.get(neighbor)}`, 51, true, null, null, null, null, neighbor, "bfs");
                
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                    snap(`Constraint removed! In-Degree of '${neighbor}' reached 0. Enqueue '${neighbor}'.`, 53, true, null, null, null, null, neighbor, "bfs");
                }
            }
        }
    }

    snap(`Topological sort complete! Validated count ${count} nodes against size ${inDegree.size}.`, 59, false, null, null, null, null, null, "bfs");
    snap(`Successfully verified full Alien lexical order mapping: "${result}"`, 63, true, null, null, null, null, null, "bfs");

    return s;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-4 text-muted-foreground uppercase tracking-widest text-center">
              Dictionary Analysis
            </h3>
            <div className="flex flex-col gap-1 w-full max-w-[200px] mx-auto border-l-2 border-primary/20 pl-4 py-2 relative">
                {step?.words.map((word, wIdx) => {
                    const isActivePair = step.i !== null && (wIdx === step.i || wIdx === step.i + 1);
                    return (
                        <div key={wIdx} className={`font-mono text-sm px-2 py-1 rounded transition-colors flex gap-1 ${isActivePair ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}>
                            {word.split('').map((ch, charIdx) => {
                                const isComparing = isActivePair && step.j === charIdx;
                                const isMismatch = isComparing && step.isMatch;
                                return (
                                    <div key={charIdx} className={`w-6 h-6 flex items-center justify-center rounded border ${isMismatch ? 'bg-red-500/20 border-red-500/50 text-red-500 font-bold scale-110' : isComparing ? 'bg-blue-500/20 border-blue-500/50 text-blue-500 scale-110' : 'border-transparent'}`}>
                                        {ch}
                                    </div>
                                )
                            })}
                        </div>
                    );
                })}
                {step?.i !== null && (
                    <div 
                        className="absolute left-[-4px] w-2.5 h-12 border-l-2 border-primary/50 transition-all duration-300"
                        style={{ top: `${(step.i * 32) + 12}px` }}
                    />
                )}
            </div>
          </Card>

          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5 min-h-[160px]">
            <div className="grid grid-cols-2 gap-4 h-full">
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">
                    InDegree
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                    {step?.inDegree && Object.entries(step.inDegree).map(([char, degree]) => (
                        <div key={char} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold font-mono transition-all duration-300 ${step.currentChar === char ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background z-10' : ''} ${degree === 0 ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-muted/50 border border-border text-foreground/70'}`}>
                                {char}
                            </div>
                            <span className={`text-[10px] mt-1 font-mono font-bold ${degree === 0 ? 'text-green-500' : 'text-muted-foreground'}`}>{degree}</span>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center border-l pl-4">
                    Graph (Adj)
                    </h3>
                    <div className="flex flex-col gap-2 border-l pl-4 pb-2 text-sm justify-center">
                    {step?.adj && Object.entries(step.adj).map(([char, neighbors]) => (
                        <div key={char} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center font-bold bg-primary/20 text-primary border border-primary/30">
                                {char}
                            </div>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <div className="flex gap-1">
                                {neighbors.length === 0 && <span className="text-muted-foreground text-[10px] italic pt-1">none</span>}
                                {neighbors.map((n, idx) => (
                                    <div key={idx} className="w-6 h-6 rounded flex items-center justify-center font-bold bg-accent text-accent-foreground border border-border">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
          </Card>

          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step?.message || ''}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
            language="typescript"
          />
          <VariablePanel
            variables={{
              queue: step?.queue ? `[${step.queue.join(', ')}]` : '[]',
              result: step?.result || '""',
              count: step?.count || 0
            }}
          />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
