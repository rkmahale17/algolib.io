import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface TrieNodeData {
  children: { [key: string]: TrieNodeData };
  isWord: boolean;
  char?: string;
  isActive?: boolean;
  isVisited?: boolean;
}

interface Step {
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
  trie: TrieNodeData;
  activePath: string[];
  operation: 'add' | 'search';
  currentWord: string;
  dfsDepth?: number;
}

const languages: VisualizationLanguageMap = {
  typescript: `class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isWord: boolean = false;
}
class WordDictionary {
  private root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }
  addWord(word: string): void {
    let cur = this.root;
    for (const c of word) {
      if (!cur.children.has(c)) {
        cur.children.set(c, new TrieNode());
      }
      cur = cur.children.get(c)!;
    }
    cur.isWord = true;
  }
  search(word: string): boolean {
    const dfs = (j: number, node: TrieNode): boolean => {
      let cur = node;
      for (let i = j; i < word.length; i++) {
        const c = word[i];
        if (c === ".") {
          for (const child of cur.children.values()) {
            if (dfs(i + 1, child)) {
              return true;
            }
          }
          return false;
        } else {
          if (!cur.children.has(c)) {
            return false;
          }
          cur = cur.children.get(c)!;
        }
      }
      return cur.isWord;
    };
    return dfs(0, this.root);
  }
}`,
  python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True

    def search(self, word: str) -> bool:
        def dfs(node, index):
            if index == len(word):
                return node.is_word
            char = word[index]
            if char == '.':
                for child in node.children.values():
                    if dfs(child, index + 1):
                        return True
                return False
            else:
                if char not in node.children:
                    return False
                return dfs(node.children[char], index + 1)
        return dfs(self.root, 0)`,
  java: `public static class WordDictionary {
    private TrieNode root;
    public WordDictionary() {
        root = new TrieNode();
    }
    public void addWord(String word) {
        TrieNode current = root;
        for (char ch : word.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                current.children.put(ch, new TrieNode());
            }
            current = current.children.get(ch);
        }
        current.isWord = true;
    }
    public boolean search(String word) {
        return searchHelper(word, 0, root);
    }
    private boolean searchHelper(String word, int index, TrieNode node) {
        if (index == word.length()) {
            return node.isWord;
        }
        char ch = word.charAt(index);
        if (ch == '.') {
            for (TrieNode child : node.children.values()) {
                if (searchHelper(word, index + 1, child)) {
                    return true;
                }
            }
            return false;
        } else {
            if (!node.children.containsKey(ch)) {
                return false;
            }
            return searchHelper(word, index + 1, node.children.get(ch));
        }
    }
}`,
  cpp: `class WordDictionary {
public:
    struct TrieNode {
        bool isEnd = false;
        unordered_map<char, TrieNode*> children;
    };
    WordDictionary() {
        root = new TrieNode();
    }
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        return dfs(root, word, 0);
    }
private:
    TrieNode* root;
    bool dfs(TrieNode* node, const string& word, int i) {
        if (i == word.length()) {
            return node->isEnd;
        }
        char c = word[i];
        if (c == '.') {
            for (auto& [ch, child] : node->children) {
                if (dfs(child, word, i + 1)) {
                    return true;
                }
            }
            return false;
        } else {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            return dfs(node->children[c], word, i + 1);
        }
    }
};`
};

export const AddAndSearchWordVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const root: TrieNodeData = { children: {}, isWord: false };

    const deepCopy = (node: TrieNodeData): TrieNodeData => {
      const newNode: TrieNodeData = { ...node, children: {} };
      for (const char in node.children) {
        newNode.children[char] = deepCopy(node.children[char]);
      }
      return newNode;
    };

    const addStep = (
      op: 'add' | 'search',
      word: string,
      msg: string,
      pseudo: string,
      variables: Record<string, any>,
      trie: TrieNodeData,
      activePath: string[],
      ts: number, py: number, java: number, cpp: number,
      depth?: number
    ) => {
      newSteps.push({
        operation: op,
        currentWord: word,
        message: msg,
        pseudoStep: pseudo,
        variables,
        trie,
        activePath,
        dfsDepth: depth
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    // addWord("bad")
    let currentTrie = deepCopy(root);
    addStep(
      'add', 'bad', 'Initialize pointer at root',
      'SET cur = root',
      { word: 'bad', cur: 'root' },
      deepCopy(currentTrie),
      [],
      11, 11, 7, 11
    );

    let curPath: string[] = [];
    let curPointer = currentTrie;
    for (const c of 'bad') {
      addStep(
        'add', 'bad', `Iterate through characters: checking '${c}'`,
        `FOR c = '${c}' IN word`,
        { word: 'bad', c, cur: curPath.join('') || 'root' },
        deepCopy(currentTrie),
        [...curPath],
        12, 12, 8, 12
      );

      addStep(
        'add', 'bad', `Check if character '${c}' exists in current node's children`,
        `IF NOT cur.children.has('${c}')`,
        { word: 'bad', c, cur: curPath.join('') || 'root' },
        deepCopy(currentTrie),
        [...curPath],
        13, 13, 9, 13
      );

      if (!curPointer.children[c]) {
        curPointer.children[c] = { children: {}, isWord: false, char: c };
        addStep(
          'add', 'bad', `Character '${c}' not found. Creating new TrieNode.`,
          `cur.children.set('${c}', NEW TrieNode)`,
          { word: 'bad', c, cur: curPath.join('') || 'root' },
          deepCopy(currentTrie),
          [...curPath],
          14, 14, 10, 14
        );
      }

      curPointer = curPointer.children[c];
      curPath.push(c);
      addStep(
        'add', 'bad', `Move current pointer to node segment '${curPath.join('')}'`,
        `SET cur = cur.children.get('${c}')`,
        { word: 'bad', c, cur: curPath.join('') },
        deepCopy(currentTrie),
        [...curPath],
        16, 15, 12, 16
      );
    }
    curPointer.isWord = true;
    addStep(
      'add', 'bad', `Finished word "bad". Mark 'isWord' as true.`,
      `SET cur.isWord = true`,
      { word: 'bad', cur: 'bad', isWord: true },
      deepCopy(currentTrie),
      ['b', 'a', 'd'],
      18, 16, 14, 18
    );

    // addWord("dad")
    addStep(
      'add', 'dad', 'Start adding word "dad"',
      'SET cur = root',
      { word: 'dad', cur: 'root' },
      deepCopy(currentTrie),
      [],
      11, 11, 7, 11
    );

    curPath = [];
    curPointer = currentTrie;
    for (const c of 'dad') {
      if (!curPointer.children[c]) {
        curPointer.children[c] = { children: {}, isWord: false, char: c };
      }
      curPointer = curPointer.children[c];
      curPath.push(c);
    }
    curPointer.isWord = true;
    addStep(
      'add', 'dad', 'Successfully added "dad" to the dictionary.',
      'RETURN',
      { word: 'dad', status: 'completed' },
      deepCopy(currentTrie),
      ['d', 'a', 'd'],
      19, 16, 15, 19
    );

    // search(".ad")
    addStep(
      'search', '.ad', 'Search pattern ".ad": start DFS from root',
      'RETURN dfs(index=0, node=root)',
      { word: '.ad', j: 0 },
      deepCopy(currentTrie),
      [],
      41, 32, 17, 21
    );

    // DFS Simulation for ".ad"
    addStep(
      'search', '.ad', 'DFS start: initialize local pointer "cur" to current node',
      'SET cur = node',
      { word: '.ad', i: 0, cur: 'root' },
      deepCopy(currentTrie),
      [],
      22, 19, 19, 25
    );

    addStep(
      'search', '.ad', 'Iterate pattern: current index 0',
      'FOR i = 0 TO word.length',
      { word: '.ad', i: 0 },
      deepCopy(currentTrie),
      [],
      23, 20, 20, 26
    );

    addStep(
      'search', '.ad', 'Pattern at index 0 is a wildcard "."',
      "IF char == '.'",
      { word: '.ad', c: '.' },
      deepCopy(currentTrie),
      [],
      25, 23, 24, 30
    );

    // Try child 'b'
    addStep(
      'search', '.ad', 'Wildcard found: iterating through all children. Trying "b"',
      'FOR child IN cur.children',
      { word: '.ad', i: 0, child: 'b' },
      deepCopy(currentTrie),
      ['b'],
      26, 24, 25, 31,
      1
    );

    addStep(
      'search', '.ad', 'Recursively call DFS for child "b" with index 1',
      'IF dfs(index=1, child=b) → CALL dfs',
      { word: '.ad', i: 0, child: 'b', nextIndex: 1 },
      deepCopy(currentTrie),
      ['b'],
      27, 25, 26, 32,
      1
    );

    // Recursive DFS for 'b' at index 1
    addStep(
      'search', '.ad', 'DFS inner: pointer "cur" at node "b"',
      'SET cur = node',
      { word: '.ad', i: 1, c: 'a', cur: 'b' },
      deepCopy(currentTrie),
      ['b'],
      22, 19, 19, 25
    );

    addStep(
      'search', '.ad', 'Iterate pattern: index 1',
      'FOR i = 1 TO word.length',
      { word: '.ad', i: 1 },
      deepCopy(currentTrie),
      ['b'],
      23, 20, 20, 26
    );

    addStep(
      'search', '.ad', 'Pattern at index 1 is "a"',
      "IF char == '.'  →  NO ✗",
      { word: '.ad', c: 'a' },
      deepCopy(currentTrie),
      ['b'],
      25, 23, 24, 30
    );

    addStep(
      'search', '.ad', 'Move pointer to child node "a"',
      "SET cur = cur.children.get('a')",
      { word: '.ad', i: 1, c: 'a', curPath: 'ba' },
      deepCopy(currentTrie),
      ['b', 'a'],
      36, 31, 35, 41
    );

    // Moving to index 2
    addStep(
      'search', '.ad', 'Iterate pattern: index 2',
      'FOR i = 2 TO word.length',
      { word: '.ad', i: 2 },
      deepCopy(currentTrie),
      ['b', 'a'],
      23, 20, 20, 26
    );

    addStep(
      'search', '.ad', 'Pattern at index 2 is "d"',
      "IF char == '.'  →  NO ✗",
      { word: '.ad', c: 'd' },
      deepCopy(currentTrie),
      ['b', 'a'],
      25, 23, 24, 30
    );

    addStep(
      'search', '.ad', 'Move pointer to child node "d"',
      "SET cur = cur.children.get('d')",
      { word: '.ad', i: 2, c: 'd', curPath: 'bad' },
      deepCopy(currentTrie),
      ['b', 'a', 'd'],
      36, 31, 35, 41
    );

    addStep(
      'search', '.ad', 'Reached end of search pattern. Returning node "isWord" property.',
      'RETURN cur.isWord',
      { word: '.ad', isWord: true },
      deepCopy(currentTrie),
      ['b', 'a', 'd'],
      39, 21, 21, 27
    );

    addStep(
      'search', '.ad', 'DFS returned true for child "b". Return true for pattern ".ad".',
      'RETURN true',
      { word: '.ad', result: true },
      deepCopy(currentTrie),
      ['b', 'a', 'd'],
      28, 26, 27, 33
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, []);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderTrie = (node: TrieNodeData, prefix = '', pathChars: string[] = []): JSX.Element => {
    const sortedChars = Object.keys(node.children).sort();
    const isActive = step.activePath.join('') === prefix;

    return (
      <div className="flex flex-col items-center">
        <div 
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 relative ${
            isActive 
              ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' 
              : node.isWord 
                  ? 'bg-secondary border-green-500 text-green-600'
                  : 'bg-card border-muted-foreground/30 text-muted-foreground'
          }`}
          title={prefix || 'root'}
        >
          {node.char || 'R'}
          {node.isWord && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        </div>
        {sortedChars.length > 0 && (
          <div className="flex gap-4 mt-4 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-muted-foreground/20" />
            {sortedChars.map(char => (
              <div key={char} className="relative pt-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-muted-foreground/20" />
                {renderTrie(node.children[char], prefix + char, [...pathChars, char])}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
        <div className="flex flex-col gap-6 overflow-auto pr-2 h-full">
          <Card className="p-6 shrink-0">
            <h3 className="text-lg font-semibold mb-2">
              {step.operation === 'add' ? 'Operation: addWord' : 'Operation: search'}
              <span className="ml-2 text-primary font-mono">("{step.currentWord}")</span>
            </h3>
            <p className="text-sm text-balance leading-relaxed h-12">
              {step.message}
            </p>
          </Card>

          <Card className="p-6 flex-1 flex flex-col items-center justify-center bg-muted/5 min-h-[400px]">
            <div className="w-full flex justify-center overflow-auto p-4">
               {renderTrie(step.trie)}
            </div>
          </Card>

          <VariablePanel
            variables={step.variables}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
    />
  );
};
