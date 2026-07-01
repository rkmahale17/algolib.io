import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Share2 } from 'lucide-react';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  queue: string[];
  visited: string[];
  level: number;
  currentWord: string | null;
  currentPattern: string | null;
  neighbors: Record<string, string[]>;
  message: string;
  pseudoStep: string;
  found: boolean;
  resultLevel: number;
}

const languages: VisualizationLanguageMap = {
  typescript: `function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  if (!wordList.includes(endWord)) return 0;
  const neighbors = new Map<string, string[]>();
  const words = [...wordList, beginWord];
  for (const word of words) {
    for (let j = 0; j < word.length; j++) {
      const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
      if (!neighbors.has(pattern)) {
        neighbors.set(pattern, []);
      }
      neighbors.get(pattern)!.push(word);
    }
  }
  const visited = new Set<string>([beginWord]);
  const queue: string[] = [beginWord];
  let level = 1;
  while (queue.length > 0) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const word = queue.shift()!;
      if (word === endWord) {
        return level;
      }
      for (let j = 0; j < word.length; j++) {
        const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
        const nextWords = neighbors.get(pattern) || [];
        for (const nextWord of nextWords) {
          if (!visited.has(nextWord)) {
            visited.add(nextWord);
            queue.push(nextWord);
          }
        }
      }
    }
    level++;
  }
  return 0;
}`,
  python: `class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        if endWord not in wordList:
            return 0
        neighbors = defaultdict(list)
        words = wordList + [beginWord]
        for word in words:
            for i in range(len(word)):
                pattern = word[:i] + "*" + word[i + 1:]
                neighbors[pattern].append(word)
        visited = {beginWord}
        queue = deque([beginWord])
        level = 1
        while queue:
            size = len(queue)
            for _ in range(size):
                word = queue.popleft()
                if word == endWord:
                    return level
                for i in range(len(word)):
                    pattern = word[:i] + "*" + word[i + 1:]
                    for next_word in neighbors[pattern]:
                        if next_word not in visited:
                            visited.add(next_word)
                            queue.append(next_word)
            level += 1
        return 0`,
  java: `public static class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        if (!wordList.contains(endWord)) {
            return 0;
        }
        Map<String, List<String>> neighbors = new HashMap<>();
        List<String> words = new ArrayList<>(wordList);
        words.add(beginWord);
        for (String word : words) {
            for (int i = 0; i < word.length(); i++) {
                String pattern = word.substring(0, i) + "*" + word.substring(i + 1);
                neighbors.computeIfAbsent(pattern, k -> new ArrayList<>()).add(word);
            }
        }
        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        int level = 1;
        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                String word = queue.poll();
                if (word.equals(endWord)) {
                    return level;
                }
                for (int j = 0; j < word.length(); j++) {
                    String pattern = word.substring(0, j) + "*" + word.substring(j + 1);
                    for (String nextWord : neighbors.getOrDefault(pattern, Collections.emptyList())) {
                        if (!visited.contains(nextWord)) {
                            visited.add(nextWord);
                            queue.offer(nextWord);
                        }
                    }
                }
            }
            level++;
        }
        return 0;
    }
}`,
  cpp: `class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        bool found = false;
        for (const auto& word : wordList) {
            if (word == endWord) {
                found = true;
                break;
            }
        }
        if (!found) return 0;
        unordered_map<string, vector<string>> neighbors;
        vector<string> words = wordList;
        words.push_back(beginWord);
        for (const string& word : words) {
            for (int i = 0; i < word.size(); i++) {
                string pattern = word.substr(0, i) + "*" + word.substr(i + 1);
                neighbors[pattern].push_back(word);
            }
        }
        unordered_set<string> visited;
        visited.insert(beginWord);
        queue<string> q;
        q.push(beginWord);
        int level = 1;
        while (!q.empty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                string word = q.front();
                q.pop();
                if (word == endWord) return level;
                for (int j = 0; j < word.size(); j++) {
                    string pattern = word.substr(0, j) + "*" + word.substr(j + 1);
                    for (const string& nextWord : neighbors[pattern]) {
                        if (!visited.count(nextWord)) {
                            visited.insert(nextWord);
                            q.push(nextWord);
                        }
                    }
                }
            }
            level++;
        }
        return 0;
    }
};`
};

export const WordLadderVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const beginWord = "hit";
  const endWord = "cog";
  const wordList = useMemo(() => ["hot", "dot", "dog", "lot", "log", "cog"], []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const neighbors: Record<string, string[]> = {};
    const visited = new Set<string>();
    const queue: string[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    let level = 1;

    const addStep = (
      message: string,
      pseudo: string,
      currentWord: string | null = null,
      currentPattern: string | null = null,
      found: boolean = false,
      resultLevel: number = 0,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        queue: [...queue],
        visited: Array.from(visited),
        level,
        currentWord,
        currentPattern,
        neighbors: JSON.parse(JSON.stringify(neighbors)),
        message,
        pseudoStep: pseudo,
        found,
        resultLevel
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      `Check if wordList contains endWord "${endWord}".`,
      `IF endWord NOT IN wordList  →  "${endWord}" IN [${wordList.join(", ")}]`,
      null, null, false, 0,
      2, 3, 3, 4
    );

    if (!wordList.includes(endWord)) {
      addStep(
        `endWord not found in wordList. Return 0.`,
        "RETURN 0",
        null, null, false, 0,
        2, 4, 4, 11
      );
      return { steps: newSteps, stepLineNumbers: lines };
    }

    addStep(
      `Initialize neighbors map to store patterns.`,
      "SET neighbors = defaultdict(list)",
      null, null, false, 0,
      3, 5, 6, 12
    );
    const words = [...wordList, beginWord];
    addStep(
      `Combine wordList and beginWord for preprocessing.`,
      `SET words = wordList + [beginWord]`,
      null, null, false, 0,
      4, 6, 7, 13
    );

    addStep(
      `Start building the generalized graph using one-character-wildcard patterns.`,
      `FOR word IN words`,
      null, null, false, 0,
      5, 7, 9, 15
    );
    for (const word of words) {
      for (let j = 0; j < word.length; j++) {
        const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
        if (!neighbors[pattern]) {
          neighbors[pattern] = [];
        }
        neighbors[pattern].push(word);
      }
    }
    addStep(
      `Graph construction complete. Wildcard patterns are mapped.`,
      "// Preprocessing finished",
      null, null, false, 0,
      13, 10, 14, 20
    );

    visited.add(beginWord);
    addStep(
      `Initialize visited set with beginWord "${beginWord}" to prevent cycles.`,
      `SET visited = {"${beginWord}"}`,
      null, null, false, 0,
      14, 11, 15, 21
    );

    queue.push(beginWord);
    addStep(
      `Initialize BFS queue with beginWord "${beginWord}".`,
      `SET queue = deque(["${beginWord}"])`,
      null, null, false, 0,
      15, 12, 17, 23
    );
    
    addStep(
      `Set initial ladder length (level) to 1.`,
      "SET level = 1",
      null, null, false, 0,
      16, 13, 19, 25
    );

    addStep(
      `Begin main BFS loop while queue is not empty.`,
      "WHILE queue",
      null, null, false, 0,
      17, 14, 20, 26
    );
    while (queue.length > 0) {
      const size = queue.length;
      addStep(
        `Level ${level}: Get the number of nodes at the current level (size = ${size}).`,
        `SET size = len(queue)  →  ${size}`,
        null, null, false, 0,
        18, 15, 21, 27
      );

      for (let i = 0; i < size; i++) {
        const word = queue.shift()!;
        addStep(
          `Dequeue "${word}" to process.`,
          `SET word = queue.popleft()  →  "${word}"`,
          word, null, false, 0,
          20, 17, 23, 29
        );

        addStep(
          `Check if current word "${word}" is the endWord "${endWord}".`,
          `IF word == endWord  →  "${word}" == "${endWord}"`,
          word, null, false, 0,
          21, 18, 24, 31
        );
        if (word === endWord) {
          addStep(
            `Found endWord! Return current level ${level} as the shortest transformation sequence length.`,
            `RETURN level  →  ${level}`,
            word, null, true, level,
            22, 19, 25, 31
          );
          return { steps: newSteps, stepLineNumbers: lines };
        }

        for (let j = 0; j < word.length; j++) {
          const pattern = word.slice(0, j) + "*" + word.slice(j + 1);
          const nextWords = neighbors[pattern] || [];
          addStep(
            `Pattern "${pattern}": Found ${nextWords.length} potential neighbors.`,
            `FOR next_word IN neighbors["${pattern}"]`,
            word, pattern, false, 0,
            26, 22, 29, 34
          );

          for (const nextWord of nextWords) {
            if (!visited.has(nextWord)) {
              visited.add(nextWord);
              addStep(
                `Mark "${nextWord}" as visited to avoid cycles.`,
                `visited.add("${nextWord}")`,
                word, pattern, false, 0,
                29, 24, 31, 36
              );
              
              queue.push(nextWord);
              addStep(
                `Enqueue "${nextWord}" for the next level.`,
                `queue.append("${nextWord}")`,
                word, pattern, false, 0,
                30, 25, 32, 37
              );
            }
          }
        }
      }

      level++;
      addStep(
        `Finished processing level. Increment level.`,
        `SET level += 1  →  ${level}`,
        null, null, false, 0,
        35, 26, 37, 42
      );
    }

    addStep(
      `Queue is empty and endWord was not reached. Return 0.`,
      "RETURN 0",
      null, null, false, 0,
      37, 27, 39, 44
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [beginWord, endWord, wordList]);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="font-semibold text-muted-foreground mr-2">Begin:</span>
              <span className="px-2 py-1 bg-muted rounded-md font-mono text-foreground">{beginWord}</span>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground mr-2">End:</span>
              <span className="px-2 py-1 bg-muted rounded-md font-mono text-foreground">{endWord}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Current Word</span>
              <div className="flex gap-1 h-10">
                {step.currentWord ? (
                  step.currentWord.split('').map((char, i) => (
                    <div key={i} className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/30 rounded font-mono font-bold">
                      {char}
                    </div>
                  ))
                ) : (
                  <div className="h-8 flex items-center text-muted-foreground italic text-sm">None</div>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Pattern</span>
              <div className="flex gap-1 h-10">
                {step.currentPattern ? (
                  step.currentPattern.split('').map((char, i) => (
                    <div key={i} className={`w-8 h-8 flex items-center justify-center border rounded font-mono font-bold
                      ${char === '*' ? 'bg-amber-500/20 text-amber-600 border-amber-500/30 font-bold' : 'bg-muted text-foreground border-border'}
                    `}>
                      {char}
                    </div>
                  ))
                ) : (
                  <div className="h-8 flex items-center text-muted-foreground italic text-sm">None</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">BFS Queue (Level {step.level})</span>
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-xl min-h-[64px] border border-border items-center">
              {step.queue.length === 0 ? (
                <span className="text-sm text-muted-foreground italic">Queue is empty</span>
              ) : (
                step.queue.map((w, idx) => (
                  <div key={idx} className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-md font-mono text-sm shadow-sm flex items-center gap-2">
                    {w}
                    {idx === 0 && <span className="flex w-2 h-2 rounded-full bg-blue-50"></span>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Visited Words</span>
            <div className="flex flex-wrap gap-1.5">
              {step.visited.length === 0 ? (
                <span className="text-sm text-muted-foreground italic">None</span>
              ) : (
                step.visited.map((w, idx) => (
                  <div key={idx} className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded font-mono text-xs">
                    {w}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-4">
            <Card className="p-4 bg-primary/5 border border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{step.message}</p>
            </Card>

            <VariablePanel
              variables={{
                'level': step.level,
                'queue size': step.queue.length,
                'visited count': step.visited.length,
                'result': step.found ? step.resultLevel : (step.resultLevel === 0 && currentStepIndex === steps.length - 1 ? 0 : 'pending')
              }}
            />
          </div>
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
export default WordLadderVisualization;
