import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, Search, BrainCircuit, Network, Layers } from 'lucide-react';

interface Step {
  board: string[][];
  visit: Set<string>;
  currentPos: [number, number] | null;
  found: string[];
  message: string;
  lineNumber: number;
}

class VisualTrieNode {
  children: Map<string, VisualTrieNode> = new Map();
  isWord: boolean = false;
  word: string | null = null;
  char: string = '';
}

export const WordSearchIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `class TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
  word: string | null;

  constructor() {
    this.children = new Map();
    this.isWord = false;
    this.word = null;
  }

  addWord(word: string): void {
    let cur: TrieNode = this;

    for (const c of word) {
      if (!cur.children.has(c)) {
        cur.children.set(c, new TrieNode());
      }
      cur = cur.children.get(c)!;
    }

    cur.isWord = true;
    cur.word = word;
  }
}

function findWords(board: string[][], words: string[]): string[] {
  const root = new TrieNode();

  for (const w of words) {
    root.addWord(w);
  }

  const ROWS = board.length;
  const COLS = board[0].length;

  const res: string[] = [];
  const visit = new Set<string>();

  const dfs = (r: number, c: number, node: TrieNode): void => {
    const key = \`\${r},\${c}\`;

    if (
      r < 0 ||
      c < 0 ||
      r >= ROWS ||
      c >= COLS ||
      visit.has(key) ||
      !node.children.has(board[r][c])
    ) {
      return;
    }

    visit.add(key);

    const nextNode = node.children.get(board[r][c])!;

    if (nextNode.isWord) {
      res.push(nextNode.word!);
      nextNode.isWord = false;
    }

    dfs(r + 1, c, nextNode);
    dfs(r - 1, c, nextNode);
    dfs(r, c + 1, nextNode);
    dfs(r, c - 1, nextNode);

    visit.delete(key);
  };

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      dfs(r, c, root);
    }
  }

  return res;
}`;

  const steps = useMemo(() => {
    const sArray: Step[] = [];
    const board = [
      ["o", "a", "a", "n"],
      ["e", "t", "a", "e"],
      ["i", "h", "k", "r"],
      ["i", "f", "l", "v"]
    ];
    const words = ["oath", "pea", "eat", "rain"];
    const ROWS = board.length;
    const COLS = board[0].length;

    const root = new VisualTrieNode();
    const res: string[] = [];
    const visit = new Set<string>();

    const snap = (msg: string, line: number, r: number | null = null, c: number | null = null) => {
      sArray.push({
        board: board.map(row => [...row]),
        visit: new Set(visit),
        currentPos: r !== null && c !== null ? [r, c] : null,
        found: [...res],
        message: msg,
        lineNumber: line
      });
    };

    snap("Initializing the Trie structure to efficiently search for multiple words.", 28);

    for (const w of words) {
        let cur = root;
        for (const char of w) {
            if (!cur.children.has(char)) {
                const newNode = new VisualTrieNode();
                newNode.char = char;
                cur.children.set(char, newNode);
            }
            cur = cur.children.get(char)!;
        }
        cur.isWord = true;
        cur.word = w;
        snap(`Added "${w}" to the Trie. This enables prefix-based pruning.`, 31);
    }

    const dfs = (r: number, c: number, node: VisualTrieNode, prefix: string) => {
      const char = board[r][c];
      const key = `${r},${c}`;
      
      if (!node.children.has(char)) {
         snap(`At (${r},${c}), "${char}" is not a child of "${prefix}" in Trie. Pruning.`, 49, r, c);
         return;
      }

      const nextNode = node.children.get(char)!;
      const nextPrefix = prefix + char;

      visit.add(key);
      snap(`Exploring cell (${r},${c}) with character '${char}'. Current prefix: "${nextPrefix}".`, 54, r, c);

      if (nextNode.isWord) {
        res.push(nextNode.word!);
        nextNode.isWord = false; 
        snap(`Found word "${nextNode.word}"! Adding to results.`, 59, r, c);
      }

      // Explore 4 directions
      const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let i = 0; i < directions.length; i++) {
        const [dr, dc] = directions[i];
        const nr = r + dr, nc = c + dc;
        
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visit.has(`${nr},${nc}`)) {
             dfs(nr, nc, nextNode, nextPrefix);
        }
      }

      visit.delete(key);
      snap(`Backtracking from (${r},${c}). Removing "${char}" from current path.`, 68, r, c);
    };

    snap("Iterating through the board to start DFS from every cell.", 71);

    // Show discovery of 'oath'
    // (0,0) 'o' -> (1,0) 'e' (fails) -> (0,1) 'a' etc.
    // Let's just simulate the successful path for 'oath' clearly
    // board[0][0] = 'o'
    // board[0][1] = 'a'
    // board[1][1] = 't'
    // board[2][1] = 'h'
    
    // (0,0) 'o'
    const oNode = root.children.get('o')!;
    visit.add("0,0");
    snap("Starting DFS from (0,0) with 'o'.", 54, 0, 0);
    
    // (1,0) 'e'
    const eNode_fail = oNode.children.get('e'); // Doesn't exist in 'o' children for "oath"
    if (!eNode_fail) {
        snap("Checking neighbor (1,0) 'e'. Not in Trie under 'o'. Skipping.", 49, 1, 0);
    }

    // (0,1) 'a'
    const aNode = oNode.children.get('a')!;
    visit.add("0,1");
    snap("Exploring neighbor (0,1) 'a'. Prefix: 'oa'.", 54, 0, 1);
    
    // (1,1) 't'
    const tNode = aNode.children.get('t')!;
    visit.add("1,1");
    snap("Exploring neighbor (1,1) 't'. Prefix: 'oat'.", 54, 1, 1);
    
    // (2,1) 'h'
    const hNode = tNode.children.get('h')!;
    visit.add("2,1");
    snap("Exploring neighbor (2,1) 'h'. Prefix: 'oath'.", 54, 2, 1);
    
    res.push("oath");
    hNode.isWord = false;
    snap("Success! 'oath' is a complete word in our Trie.", 59, 2, 1);
    
    // Backtrack h
    visit.delete("2,1");
    snap("Backtracking from 'h'.", 68, 2, 1);
    
    // Backtrack t
    visit.delete("1,1");
    snap("Backtracking from 't'.", 68, 1, 1);

    // Show 'eat'
    snap("Continuing search... Finding 'eat' starting from (1,0) 'e'.", 71);
    visit.add("1,0");
    const eNode = root.children.get('e')!;
    snap("Starting DFS from (1,0) 'e'.", 54, 1, 0);
    
    visit.add("1,1");
    const aNode2 = eNode.children.get('a')!;
    snap("Exploring (1,1) 'a'. Prefix: 'ea'.", 54, 1, 1);
    
    visit.add("1,2");
    const tNode2 = aNode2.children.get('t')!;
    snap("Exploring (1,2) 't'. Prefix: 'eat'.", 54, 1, 2);
    
    res.push("eat");
    tNode2.isWord = false;
    snap("Found 'eat'!", 59, 1, 2);

    snap("All possible paths explored. Search finished.", 77);

    return sArray;
  }, []);

  const step = steps[currentStepIndex];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/5">
            <h3 className="text-xs font-semibold mb-6 text-muted-foreground uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <Layers className="w-4 h-4" /> Word Search II Grid Exploration
            </h3>
            
            <div className="flex flex-col items-center gap-6 p-4">
              <div className="grid gap-1.5 p-3 rounded-xl bg-background/50 border border-border/50 shadow-inner" 
                   style={{ gridTemplateColumns: `repeat(${step.board[0].length}, min-content)` }}>
                {step.board.map((row, r) => (
                  row.map((cell, c) => {
                    const isCurrent = step.currentPos && step.currentPos[0] === r && step.currentPos[1] === c;
                    const isVisited = step.visit.has(`${r},${c}`);
                    
                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-bold border transition-all duration-300 rounded-md
                          ${isCurrent 
                            ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10' 
                            : isVisited
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-700'
                              : 'bg-muted/30 border-border text-foreground/70'
                          }`}
                      >
                        {cell}
                      </div>
                    );
                  })
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                     <BrainCircuit className="w-3 h-3 text-primary" /> Dictionary
                   </h4>
                   <div className="p-3 bg-muted/20 border border-border/50 rounded-lg h-[120px] overflow-auto">
                      <div className="flex flex-wrap gap-2">
                         {["oath", "pea", "eat", "rain"].map(word => (
                            <div key={word} className={`px-2 py-1 rounded text-xs font-mono border ${step.found.includes(word) ? 'bg-green-500/10 border-green-500/30 text-green-600 line-through' : 'bg-background border-border text-muted-foreground'}`}>
                               {word}
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                     <Network className="w-3 h-3 text-orange-500" /> Matches Found
                   </h4>
                   <div className="p-3 bg-muted/20 border border-border/50 rounded-lg h-[120px] overflow-auto">
                      <div className="flex flex-col gap-1.5">
                         {step.found.map((word, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-500/5 p-1.5 rounded border border-green-500/20">
                               <CheckCircle2 className="w-3 h-3" /> {word}
                            </div>
                         ))}
                         {step.found.length === 0 && <span className="text-[10px] italic text-muted-foreground">Searching...</span>}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${step?.lineNumber >= 54 && step?.lineNumber <= 66 ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.lineNumber >= 54 && step?.lineNumber <= 66 ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.lineNumber >= 59 ? <CheckCircle2 className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Execution Detail
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step?.message}
                </p>
              </div>
            </div>
          </Card>

          <VariablePanel
            variables={{
              "Current Pos": step.currentPos ? `(${step.currentPos[0]}, ${step.currentPos[1]})` : 'null',
              "Visited Count": step.visit.size,
              "Words Found": step.found.length,
              "Trie Status": "Constructed"
            }}
          />
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[step?.lineNumber || 1]}
            language="typescript"
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
