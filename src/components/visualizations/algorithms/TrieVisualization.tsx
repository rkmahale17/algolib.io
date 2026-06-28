import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  activeNodeId: string | null;
  activePath: string[];
  insertedNodes: string[];
  endOfWordNodes: string[];
  operation: 'insert' | 'search' | 'startsWith';
  word: string;
  currentIndex: number;
  found: boolean | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `class TrieNode {
    children = new Map<string, TrieNode>();
    endOfWord = false;
}
class Trie {
    root = new TrieNode();
    insert(word: string): void {
        let cur = this.root;
        for (const c of word) {
            if (!cur.children.has(c)) {
                cur.children.set(c, new TrieNode());
            }
            cur = cur.children.get(c)!;
        }
        cur.endOfWord = true;
    }
    search(word: string): boolean {
        let cur = this.root;
        for (const c of word) {
            if (!cur.children.has(c)) {
                return false;
            }
            cur = cur.children.get(c)!;
        }
        return cur.endOfWord;
    }
    startsWith(prefix: string): boolean {
        let cur = this.root;
        for (const c of prefix) {
            if (!cur.children.has(c)) {
                return false;
            }
            cur = cur.children.get(c)!;
        }
        return true;
    }
}`,
  python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.endOfWord = False
class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word: str) -> None:
        cur = self.root
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.endOfWord = True
    def search(self, word: str) -> bool:
        cur = self.root
        for c in word:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return cur.endOfWord
    def startsWith(self, prefix: str) -> bool:
        cur = self.root
        for c in prefix:
            if c not in cur.children:
                return False
            cur = cur.children[c]
        return True`,
  java: `class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}
class Trie {
    private TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) {
                node.children.put(c, new TrieNode());
            }
            node = node.children.get(c);
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEnd;
    }
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return true;
    }
}`,
  cpp: `class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children[c]) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children[c]) return false;
            node = node->children[c];
        }
        return true;
    }
};`,
};

function generateVisualizationData() {
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: ['root'],
    endOfWordNodes: [],
    operation: 'insert',
    word: '',
    currentIndex: -1,
    found: null,
    explanation: 'Initialize the Trie with a root node.',
    pseudoStep: 'SET root = new TrieNode()',
    variables: { cur: 'root', c: '-', word: '-' }
  });
  addLines(6, 7, 7, 8);

  const inserted: string[] = ['root'];
  const endOfWord: string[] = [];

  // --- INSERT "cat" ---
  const word1 = "cat";
  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word1,
    currentIndex: -1,
    found: null,
    explanation: `Start inserting "${word1}". Set pointer 'cur' to root.`,
    pseudoStep: `CALL insert("${word1}"): cur = root`,
    variables: { cur: 'root', c: '-', word: word1 }
  });
  addLines(7, 8, 8, 10);

  let path = "";
  for (let i = 0; i < word1.length; i++) {
    const c = word1[i];
    const prevPath = path;
    path += c;
    inserted.push(path);

    const currentPathArray = ['root', ...Array.from(path).map((_, idx) => path.substring(0, idx + 1))];

    steps.push({
      activeNodeId: path,
      activePath: [...currentPathArray],
      insertedNodes: [...inserted],
      endOfWordNodes: [...endOfWord],
      operation: 'insert',
      word: word1,
      currentIndex: i,
      found: null,
      explanation: `Character '${c}' is not a child of current node. Create new TrieNode for '${c}'.`,
      pseudoStep: `IF '${c}' NOT IN cur.children → Create node and move to it`,
      variables: { cur: prevPath || 'root', c, word: word1 }
    });
    addLines(9, 10, 10, 12);

    steps.push({
      activeNodeId: path,
      activePath: [...currentPathArray],
      insertedNodes: [...inserted],
      endOfWordNodes: [...endOfWord],
      operation: 'insert',
      word: word1,
      currentIndex: i,
      found: null,
      explanation: `Move pointer 'cur' to the child node corresponding to '${c}'.`,
      pseudoStep: `SET cur = cur.children['${c}']`,
      variables: { cur: path, c, word: word1 }
    });
    addLines(12, 12, 13, 14);
  }
  endOfWord.push(word1);
  steps.push({
    activeNodeId: word1,
    activePath: ['root', 'c', 'ca', 'cat'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word1,
    currentIndex: word1.length,
    found: null,
    explanation: `Finished inserting "${word1}". Mark current node as the end of a word.`,
    pseudoStep: `SET cur.endOfWord = True`,
    variables: { cur: word1, c: '-', word: word1 }
  });
  addLines(14, 13, 15, 16);

  // --- INSERT "car" ---
  const word2 = "car";
  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: -1,
    found: null,
    explanation: `Start inserting "${word2}". Set pointer 'cur' to root.`,
    pseudoStep: `CALL insert("${word2}"): cur = root`,
    variables: { cur: 'root', c: '-', word: word2 }
  });
  addLines(7, 8, 8, 10);

  steps.push({
    activeNodeId: 'c',
    activePath: ['root', 'c'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: 0,
    found: null,
    explanation: `Character 'c' already exists in children map. Traverse into it.`,
    pseudoStep: `IF 'c' IN cur.children → Move to it`,
    variables: { cur: 'c', c: 'c', word: word2 }
  });
  addLines(12, 12, 13, 14);

  steps.push({
    activeNodeId: 'ca',
    activePath: ['root', 'c', 'ca'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: 1,
    found: null,
    explanation: `Character 'a' already exists in children map. Traverse into it.`,
    pseudoStep: `IF 'a' IN cur.children → Move to it`,
    variables: { cur: 'ca', c: 'a', word: word2 }
  });
  addLines(12, 12, 13, 14);

  inserted.push("car");
  steps.push({
    activeNodeId: 'car',
    activePath: ['root', 'c', 'ca', 'car'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: 2,
    found: null,
    explanation: `Character 'r' is not a child of current node. Create new TrieNode for 'r'.`,
    pseudoStep: `IF 'r' NOT IN cur.children → Create node and move to it`,
    variables: { cur: 'ca', c: 'r', word: word2 }
  });
  addLines(9, 10, 10, 12);

  steps.push({
    activeNodeId: 'car',
    activePath: ['root', 'c', 'ca', 'car'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: 2,
    found: null,
    explanation: `Move pointer 'cur' to the child node corresponding to 'r'.`,
    pseudoStep: `SET cur = cur.children['r']`,
    variables: { cur: 'car', c: 'r', word: word2 }
  });
  addLines(12, 12, 13, 14);

  endOfWord.push("car");
  steps.push({
    activeNodeId: 'car',
    activePath: ['root', 'c', 'ca', 'car'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'insert',
    word: word2,
    currentIndex: word2.length,
    found: null,
    explanation: `Finished inserting "${word2}". Mark current node as the end of a word.`,
    pseudoStep: `SET cur.endOfWord = True`,
    variables: { cur: 'car', c: '-', word: word2 }
  });
  addLines(14, 13, 15, 16);

  // --- SEARCH "cat" ---
  const search1 = "cat";
  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search1,
    currentIndex: -1,
    found: null,
    explanation: `Start searching for "${search1}". Set pointer 'cur' to root.`,
    pseudoStep: `CALL search("${search1}"): cur = root`,
    variables: { cur: 'root', c: '-', word: search1 }
  });
  addLines(16, 15, 17, 18);

  const searchPath1 = ["c", "ca", "cat"];
  for (let i = 0; i < search1.length; i++) {
    const c = search1[i];
    const node = searchPath1[i];
    const currentPathArray = ['root', ...searchPath1.slice(0, i + 1)];
    steps.push({
      activeNodeId: node,
      activePath: [...currentPathArray],
      insertedNodes: [...inserted],
      endOfWordNodes: [...endOfWord],
      operation: 'search',
      word: search1,
      currentIndex: i,
      found: null,
      explanation: `Character '${c}' is in children. Move pointer 'cur' to child node.`,
      pseudoStep: `IF '${c}' IN cur.children → Move to it`,
      variables: { cur: node, c, word: search1 }
    });
    addLines(20, 19, 21, 22);
  }

  steps.push({
    activeNodeId: 'cat',
    activePath: ['root', 'c', 'ca', 'cat'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search1,
    currentIndex: search1.length,
    found: true,
    explanation: `Reached end of search word "${search1}". Current node is marked as end of word. Return True (Word Found).`,
    pseudoStep: `RETURN cur.endOfWord  →  True`,
    variables: { cur: 'cat', c: '-', word: search1, result: 'True' }
  });
  addLines(22, 20, 23, 24);

  // --- STARTSWITH "ca" ---
  const prefix1 = "ca";
  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'startsWith',
    word: prefix1,
    currentIndex: -1,
    found: null,
    explanation: `Start prefix search for "${prefix1}". Set pointer 'cur' to root.`,
    pseudoStep: `CALL startsWith("${prefix1}"): cur = root`,
    variables: { cur: 'root', c: '-', word: prefix1 }
  });
  addLines(25, 80, 111, 147);

  const prefixPath1 = ["c", "ca"];
  for (let i = 0; i < prefix1.length; i++) {
    const c = prefix1[i];
    const node = prefixPath1[i];
    const currentPathArray = ['root', ...prefixPath1.slice(0, i + 1)];
    steps.push({
      activeNodeId: node,
      activePath: [...currentPathArray],
      insertedNodes: [...inserted],
      endOfWordNodes: [...endOfWord],
      operation: 'startsWith',
      word: prefix1,
      currentIndex: i,
      found: null,
      explanation: `Character '${c}' is in children. Move pointer 'cur' to child node.`,
      pseudoStep: `IF '${c}' IN cur.children → Move to it`,
      variables: { cur: node, c, word: prefix1 }
    });
    addLines(29, 82, 113, 149);
  }

  steps.push({
    activeNodeId: 'ca',
    activePath: ['root', 'c', 'ca'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'startsWith',
    word: prefix1,
    currentIndex: prefix1.length,
    found: true,
    explanation: `Successfully matched entire prefix "${prefix1}". Return True (Prefix Found).`,
    pseudoStep: `RETURN True`,
    variables: { cur: 'ca', c: '-', word: prefix1, result: 'True' }
  });
  addLines(34, 85, 116, 152);

  // --- SEARCH "cap" ---
  const search2 = "cap";
  steps.push({
    activeNodeId: 'root',
    activePath: ['root'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search2,
    currentIndex: -1,
    found: null,
    explanation: `Start searching for "${search2}". Set pointer 'cur' to root.`,
    pseudoStep: `CALL search("${search2}"): cur = root`,
    variables: { cur: 'root', c: '-', word: search2 }
  });
  addLines(16, 15, 17, 18);

  steps.push({
    activeNodeId: 'c',
    activePath: ['root', 'c'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search2,
    currentIndex: 0,
    found: null,
    explanation: `Character 'c' is in children. Move pointer 'cur' to child node.`,
    pseudoStep: `IF 'c' IN cur.children → Move to it`,
    variables: { cur: 'c', c: 'c', word: search2 }
  });
  addLines(20, 19, 21, 22);

  steps.push({
    activeNodeId: 'ca',
    activePath: ['root', 'c', 'ca'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search2,
    currentIndex: 1,
    found: null,
    explanation: `Character 'a' is in children. Move pointer 'cur' to child node.`,
    pseudoStep: `IF 'a' IN cur.children → Move to it`,
    variables: { cur: 'ca', c: 'a', word: search2 }
  });
  addLines(20, 19, 21, 22);

  steps.push({
    activeNodeId: 'ca',
    activePath: ['root', 'c', 'ca'],
    insertedNodes: [...inserted],
    endOfWordNodes: [...endOfWord],
    operation: 'search',
    word: search2,
    currentIndex: 2,
    found: false,
    explanation: `Character 'p' not found in children map of 'ca'. Search fails. Return False (Word Not Found).`,
    pseudoStep: `IF 'p' NOT IN cur.children  →  RETURN False`,
    variables: { cur: 'ca', c: 'p', word: search2, result: 'False' }
  });
  addLines(19, 18, 20, 21);

  return { steps, stepLineNumbers };
}

const nodePositions: Record<string, { x: number; y: number; label: string }> = {
  root: { x: 200, y: 30, label: 'root' },
  c: { x: 200, y: 85, label: 'c' },
  ca: { x: 200, y: 140, label: 'a' },
  cat: { x: 130, y: 195, label: 't' },
  car: { x: 270, y: 195, label: 'r' }
};

const treeEdges = [
  { from: 'root', to: 'c' },
  { from: 'c', to: 'ca' },
  { from: 'ca', to: 'cat' },
  { from: 'ca', to: 'car' }
];

export const TrieVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => { setCurrentStepIndex(0); setIsPlaying(false); };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 flex flex-col items-center justify-center relative">
            <div className="flex items-center gap-3 mb-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {currentStep.operation}: "{currentStep.word}"
              </h4>
              {currentStep.found !== null && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse ${
                  currentStep.found
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {currentStep.found ? 'FOUND ✓' : 'NOT FOUND ✗'}
                </span>
              )}
            </div>
            <svg viewBox="0 0 400 240" className="w-full max-w-[400px] h-auto font-mono">
              {treeEdges.map((edge, idx) => {
                const fromNode = nodePositions[edge.from];
                const toNode = nodePositions[edge.to];
                
                const fromIdx = currentStep.activePath.indexOf(edge.from);
                const toIdx = currentStep.activePath.indexOf(edge.to);
                const isActiveEdge = fromIdx !== -1 && toIdx !== -1 && toIdx === fromIdx + 1;
                
                const isFinalSuccess = currentStep.found === true && currentStep.activePath.includes(edge.to);
                const isFinalFailure = currentStep.found === false && currentStep.activePath.includes(edge.to);

                let strokeClass = 'stroke-border stroke-1';
                if (isFinalSuccess) {
                  strokeClass = 'stroke-green-500 stroke-2';
                } else if (isFinalFailure) {
                  strokeClass = 'stroke-red-500 stroke-2';
                } else if (isActiveEdge) {
                  strokeClass = 'stroke-primary stroke-2';
                }

                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className={`transition-colors duration-200 ${strokeClass}`}
                  />
                );
              })}

              {Object.entries(nodePositions).map(([id, pos]) => {
                const isCreated = currentStep.insertedNodes.includes(id);
                const isActive = currentStep.activeNodeId === id;
                const isEnd = currentStep.endOfWordNodes.includes(id);
                const inActivePath = currentStep.activePath.includes(id);

                if (!isCreated) return null;

                let circleClass = 'fill-card stroke-border';
                let textClass = 'fill-foreground';
                
                if (isActive) {
                  if (currentStep.found === true) {
                    circleClass = 'fill-green-500 stroke-green-600 animate-pulse';
                    textClass = 'fill-white font-bold';
                  } else if (currentStep.found === false) {
                    circleClass = 'fill-red-500 stroke-red-600 animate-pulse';
                    textClass = 'fill-white font-bold';
                  } else {
                    circleClass = 'fill-primary stroke-primary';
                    textClass = 'fill-primary-foreground font-bold';
                  }
                } else if (inActivePath) {
                  if (currentStep.found === true) {
                    circleClass = 'fill-green-500/20 stroke-green-500/50';
                    textClass = 'fill-green-600 font-medium';
                  } else if (currentStep.found === false) {
                    circleClass = 'fill-red-500/20 stroke-red-500/50';
                    textClass = 'fill-red-600 font-medium';
                  } else {
                    circleClass = 'fill-primary/10 stroke-primary/30';
                    textClass = 'fill-primary font-medium';
                  }
                } else if (isEnd) {
                  circleClass = 'fill-card stroke-green-500 stroke-2';
                }

                return (
                  <g key={id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      className={`transition-colors duration-200 ${circleClass}`}
                      strokeWidth={isEnd || isActive ? 2 : 1}
                    />
                    {isEnd && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="12"
                        className="fill-none stroke-green-500/50"
                        strokeWidth="1"
                      />
                    )}
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dy="0.33em"
                      className={`text-xs font-semibold ${textClass}`}
                    >
                      {pos.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-[10px] text-muted-foreground border-t border-border/50 pt-2 w-full">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-sm" /> Active Node</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-green-500 rounded-sm" /> End of Word</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-sm" /> Found State</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-sm" /> Not Found State</span>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
