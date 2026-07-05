import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { CheckCircle2, Search, BrainCircuit, Network, Layers } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  board: string[][];
  visit: Set<string>;
  currentPos: [number, number] | null;
  found: string[];
  message: string;
  pseudoStep: string;
}

class VisualTrieNode {
  children: Map<string, VisualTrieNode> = new Map();
  isWord: boolean = false;
  word: string | null = null;
  char: string = '';
}

const languages: VisualizationLanguageMap = {
  typescript: `class TrieNode {
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
}`,
  python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False
    def add_word(self, word):
        cur = self
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.is_word = True

def findWords(board, words):
    root = TrieNode()
    for word in words:
        root.add_word(word)
    ROWS, COLS = len(board), len(board[0])
    res = set()
    visit = set()
    def dfs(r, c, node, word):
        if (
            r < 0
            or c < 0
            or r >= ROWS
            or c >= COLS
            or (r, c) in visit
            or board[r][c] not in node.children
        ):
            return
        visit.add((r, c))
        node = node.children[board[r][c]]
        word += board[r][c]
        if node.is_word:
            res.add(word)
        dfs(r + 1, c, node, word)
        dfs(r - 1, c, node, word)
        dfs(r, c + 0, node, word)
        dfs(r, c - 1, node, word)
        visit.remove((r, c))
    for r in range(ROWS):
        for c in range(COLS):
            dfs(r, c, root, "")
    return list(res)`,
  java: `public static class Solution {
    class TrieNode {
        Map<Character, TrieNode> children;
        boolean isWord;
        public TrieNode() {
            this.children = new HashMap<>();
            this.isWord = false;
        }
        public void addWord(String word) {
            TrieNode cur = this;
            for (char c : word.toCharArray()) {
                if (!cur.children.containsKey(c)) {
                    cur.children.put(c, new TrieNode());
                }
                cur = cur.children.get(c);
            }
            cur.isWord = true;
        }
    }
    public List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            root.addWord(w);
        }
        int ROWS = board.length;
        int COLS = board[0].length;
        Set<String> res = new HashSet<>();
        Set<String> visit = new HashSet<>();
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                dfs(r, c, root, "", board, res, visit);
            }
        }
        return new ArrayList<>(res);
    }
    private void dfs(int r, int c, TrieNode node, String word, char[][] board, Set<String> res, Set<String> visit) {
        int ROWS = board.length;
        int COLS = board[0].length;
        String key = r + "," + c;
        if (
            r < 0 ||
            c < 0 ||
            r >= ROWS ||
            c >= COLS ||
            visit.contains(key) ||
            !node.children.containsKey(board[r][c])
        ) {
            return;
        }
        visit.add(key);
        node = node.children.get(board[r][c]);
        word += board[r][c];
        if (node.isWord) {
            res.add(word);
        }
        dfs(r + 1, c, node, word, board, res, visit);
        dfs(r - 1, c, node, word, board, res, visit);
        dfs(r, c + 1, node, word, board, res, visit);
        dfs(r, c - 1, node, word, board, res, visit);
        visit.remove(key);
    }
}`,
  cpp: `class Solution {
public:
    struct TrieNode {
        unordered_map<char, TrieNode*> children;
        string word = "";
    };
    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node, set<string>& result) {
        if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size()) return;
        char ch = board[r][c];
        if (ch == '#' || node->children.find(ch) == node->children.end()) return;
        node = node->children[ch];
        if (!node->word.empty()) {
            result.insert(node->word);
        }
        board[r][c] = '#';
        dfs(board, r+1, c, node, result);
        dfs(board, r-1, c, node, result);
        dfs(board, r, c+1, node, result);
        dfs(board, r, c-1, node, result);
        board[r][c] = ch;
    }
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        TrieNode* root = new TrieNode();
        for (const string& word : words) {
            TrieNode* node = root;
            for (char c : word) {
                if (node->children.find(c) == node->children.end()) {
                    node->children[c] = new TrieNode();
                }
                node = node->children[c];
            }
            node->word = word;
        }
        set<string> result;
        for (int r = 0; r < board.size(); r++) {
            for (int c = 0; c < board[0].size(); c++) {
                dfs(board, r, c, root, result);
            }
        }
        return vector<string>(result.begin(), result.end());
    }
};`
};

const stepLineNumbers: StepLineNumberMap = {
  typescript: [1, 25, 25, 25, 25, 57, 43, 39, 43, 43, 43, 46, 53, 53, 57, 43, 43, 43, 46, 60],
  python: [1, 16, 16, 16, 16, 42, 30, 27, 30, 30, 30, 33, 39, 39, 42, 30, 30, 30, 33, 43],
  java: [3, 24, 24, 24, 24, 32, 51, 47, 51, 51, 51, 54, 61, 61, 32, 51, 51, 51, 54, 35],
  cpp: [3, 32, 32, 32, 32, 37, 15, 10, 15, 15, 15, 12, 20, 20, 37, 15, 15, 15, 12, 40]
};

export const WordSearchIIVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

    const snap = (msg: string, pseudo: string, r: number | null = null, c: number | null = null) => {
      sArray.push({
        board: board.map(row => [...row]),
        visit: new Set(visit),
        currentPos: r !== null && c !== null ? [r, c] : null,
        found: [...res],
        message: msg,
        pseudoStep: pseudo
      });
    };

    snap("Initializing the Trie structure to efficiently search for multiple words.", "SET root = NEW TrieNode()");

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
        snap(`Added "${w}" to the Trie. This enables prefix-based pruning.`, `CALL root.addWord("${w}")`);
    }

    snap("Iterating through the board to start DFS from every cell.", "FOR r = 0 TO ROWS, c = 0 TO COLS");

    // (0,0) 'o'
    const oNode = root.children.get('o')!;
    visit.add("0,0");
    snap("Starting DFS from (0,0) with 'o'.", "CALL dfs(r=0, c=0, node=root)", 0, 0);
    
    // (1,0) 'e' (fails)
    const eNode_fail = oNode.children.get('e');
    if (!eNode_fail) {
        snap("Checking neighbor (1,0) 'e'. Not in Trie under 'o'. Skipping.", "IF NOT node.children.has('e')  →  PRUNE", 1, 0);
    }

    // (0,1) 'a'
    const aNode = oNode.children.get('a')!;
    visit.add("0,1");
    snap("Exploring neighbor (0,1) 'a'. Prefix: 'oa'.", "CALL dfs(r=0, c=1, node=oNode)", 0, 1);
    
    // (1,1) 't'
    const tNode = aNode.children.get('t')!;
    visit.add("1,1");
    snap("Exploring neighbor (1,1) 't'. Prefix: 'oat'.", "CALL dfs(r=1, c=1, node=aNode)", 1, 1);
    
    // (2,1) 'h'
    const hNode = tNode.children.get('h')!;
    visit.add("2,1");
    snap("Exploring neighbor (2,1) 'h'. Prefix: 'oath'.", "CALL dfs(r=2, c=1, node=tNode)", 2, 1);
    
    res.push("oath");
    hNode.isWord = false;
    snap("Success! 'oath' is a complete word in our Trie.", 'IF nextNode.isWord  →  res.push("oath")', 2, 1);
    
    // Backtrack h
    visit.delete("2,1");
    snap("Backtracking from 'h'.", 'visit.delete("2,1") (backtrack)', 2, 1);
    
    // Backtrack t
    visit.delete("1,1");
    snap("Backtracking from 't'.", 'visit.delete("1,1") (backtrack)', 1, 1);

    // Show 'eat'
    snap("Continuing search... Finding 'eat' starting from (1,0) 'e'.", "FOR r = 1, c = 0");
    visit.add("1,0");
    const eNode = root.children.get('e')!;
    snap("Starting DFS from (1,0) 'e'.", "CALL dfs(r=1, c=0, node=root)", 1, 0);
    
    visit.add("1,1");
    const aNode2 = eNode.children.get('a')!;
    snap("Exploring (1,1) 'a'. Prefix: 'ea'.", "CALL dfs(r=1, c=1, node=eNode)", 1, 1);
    
    visit.add("1,2");
    const tNode2 = aNode2.children.get('t')!;
    snap("Exploring (1,2) 't'. Prefix: 'eat'.", "CALL dfs(r=1, c=2, node=aNode2)", 1, 2);
    
    res.push("eat");
    tNode2.isWord = false;
    snap("Found 'eat'!", 'IF nextNode.isWord  →  res.push("eat")', 1, 2);

    snap("All possible paths explored. Search finished.", "RETURN res");

    return sArray;
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
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
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={() => setCurrentStepIndex(0)}
          />
          <Card className="p-4 border-l-4 border-primary relative overflow-hidden transition-all duration-300 shadow-sm flex items-center bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary">
                {step.found.length > 0 ? <CheckCircle2 className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Execution Detail
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90 leading-tight">
                  {step.message}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
    />
  );
};
