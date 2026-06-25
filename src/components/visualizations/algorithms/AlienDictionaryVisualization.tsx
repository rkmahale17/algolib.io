import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
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
  explanation: string;
  isMatch?: boolean;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function alienOrder(words: string[]): string {
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  for (const word of words) {
    for (const char of word) {
      inDegree.set(char, 0);
      adj.set(char, []);
    }
  }
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    const len = Math.min(w1.length, w2.length);
    let found = false;
    for (let j = 0; j < len; j++) {
      if (w1[j] !== w2[j]) {
        if (!adj.get(w1[j])!.includes(w2[j])) {
          adj.get(w1[j])!.push(w2[j]);
          inDegree.set(w2[j], inDegree.get(w2[j])! + 1);
        }
        found = true;
        break;
      }
    }
    if (!found && w1.length > w2.length) return "";
  }
  const queue: string[] = [];
  for (const [char, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(char);
  }
  let result = "";
  while (queue.length > 0) {
    const char = queue.shift()!;
    result += char;
    for (const neighbor of adj.get(char)!) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  return result.length === inDegree.size ? result : "";
}`,

  python: `def alienOrder(words: list[str]) -> str:
    adj = {c: set() for w in words for c in w}
    inDegree = {c: 0 for w in words for c in w}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i + 1]
        minLen = min(len(w1), len(w2))
        if len(w1) > len(w2) and w1[:minLen] == w2[:minLen]:
            return ""
        for j in range(minLen):
            if w1[j] != w2[j]:
                if w2[j] not in adj[w1[j]]:
                    adj[w1[j]].add(w2[j])
                    inDegree[w2[j]] += 1
                break
    queue = [c for c in inDegree if inDegree[c] == 0]
    result = []
    while queue:
        c = queue.pop(0)
        result.append(c)
        for neighbor in adj[c]:
            inDegree[neighbor] -= 1
            if inDegree[neighbor] == 0:
                queue.append(neighbor)
    if len(result) < len(inDegree):
        return ""
    return "".join(result)`,

  java: `public static class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();
        for (String word : words) {
            for (char c : word.toCharArray()) {
                inDegree.put(c, 0);
                adj.put(c, new HashSet<>());
            }
        }
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i];
            String w2 = words[i + 1];
            int minLen = Math.min(w1.length(), w2.length());
            if (w1.length() > w2.length() && w1.substring(0, minLen).equals(w2.substring(0, minLen))) {
                return "";
            }
            for (int j = 0; j < minLen; j++) {
                char parent = w1.charAt(j);
                char child = w2.charAt(j);
                if (parent != child) {
                    if (!adj.get(parent).contains(child)) {
                        adj.get(parent).add(child);
                        inDegree.put(child, inDegree.get(child) + 1);
                    }
                    break;
                }
            }
        }
        Queue<Character> queue = new LinkedList<>();
        for (char c : inDegree.keySet()) {
            if (inDegree.get(c) == 0) {
                queue.offer(c);
            }
        }
        StringBuilder sb = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            sb.append(c);
            for (char neighbor : adj.get(c)) {
                inDegree.put(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) == 0) {
                    queue.offer(neighbor);
                }
            }
        }
        return sb.length() == inDegree.size() ? sb.toString() : "";
    }
}`,

  cpp: `class Solution {
public:
    string alienOrder(vector<string>& words) {
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> inDegree;
        for (const string& w : words) {
            for (char c : w) {
                inDegree[c] = 0;
                adj[c] = unordered_set<char>();
            }
        }
        for (size_t i = 0; i < words.size() - 1; i++) {
            string w1 = words[i], w2 = words[i + 1];
            size_t minLen = min(w1.size(), w2.size());
            if (w1.size() > w2.size() && w1.compare(0, minLen, w2, 0, minLen) == 0) {
                return "";
            }
            for (size_t j = 0; j < minLen; j++) {
                char parent = w1[j], child = w2[j];
                if (parent != child) {
                    if (!adj[parent].count(child)) {
                        adj[parent].insert(child);
                        inDegree[child]++;
                    }
                    break;
                }
            }
        }
        queue<char> q;
        for (auto const& [c, degree] : inDegree) {
            if (degree == 0) q.push(c);
        }
        string result = "";
        while (!q.empty()) {
            char c = q.front(); q.pop();
            result += c;
            for (char neighbor : adj[c]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) q.push(neighbor);
            }
        }
        return result.size() == inDegree.size() ? result : "";
    }
};`
};

export const AlienDictionaryVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const stepLines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLines.typescript!.push(ts);
      stepLines.python!.push(py);
      stepLines.java!.push(java);
      stepLines.cpp!.push(cpp);
    };

    const words = ["wrt", "wrf", "er", "ett", "rftt"];
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    const queue: string[] = [];
    let result = "";
    let count = 0;

    const makeSnapshot = (
      msg: string, 
      pseudo: string, 
      ts: number, 
      py: number, 
      java: number, 
      cpp: number, 
      isMatch: boolean = false, 
      i: number | null = null, 
      j: number | null = null, 
      word1: string | null = null, 
      word2: string | null = null,
      currentChar: string | null = null
    ) => {
      stepsList.push({
        words: [...words],
        adj: Object.fromEntries(adj),
        inDegree: Object.fromEntries(inDegree),
        queue: [...queue],
        result,
        count,
        i, j, word1, word2, currentChar,
        explanation: msg,
        isMatch,
        pseudoStep: pseudo
      });
      addLines(ts, py, java, cpp);
    };

    // Step 1: Start
    makeSnapshot("Start the Alien Dictionary algorithm to determine character ordering.", "START alienOrder(words)", 1, 1, 2, 3);

    // Step 2: Init
    makeSnapshot("Initialize adjacency list and in-degree maps.", "SET adj = {}, inDegree = {}", 2, 2, 4, 4);

    // Populate unique characters
    for (const word of words) {
      for (const char of word) {
        if (!inDegree.has(char)) {
          inDegree.set(char, 0);
          adj.set(char, []);
        }
      }
    }
    makeSnapshot("Initialize all unique characters in the dictionary with an in-degree of 0.", "FOR char in words → inDegree[char] = 0", 4, 3, 5, 10);

    // Build graph edges
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];
      const len = Math.min(w1.length, w2.length);
      let found = false;

      makeSnapshot(`Compare adjacent words: "${w1}" and "${w2}"`, `FOR i = ${i} (Compare "${w1}" and "${w2}")`, 10, 4, 11, 12, false, i, null, w1, w2);

      for (let j = 0; j < len; j++) {
        const c1 = w1[j];
        const c2 = w2[j];
        makeSnapshot(`Compare character index ${j}: '${c1}' vs '${c2}'`, `IF word1[${j}] != word2[${j}]`, 14, 8, 17, 18, false, i, j, w1, w2);

        if (c1 !== c2) {
          if (!adj.get(c1)!.includes(c2)) {
            adj.get(c1)!.push(c2);
            inDegree.set(c2, inDegree.get(c2)! + 1);
            makeSnapshot(
              `First difference found: '${c1}' must come before '${c2}'. Add edge ${c1} → ${c2} and increment in-degree of '${c2}'.`,
              `adj[${c1}].add(${c2}) & inDegree[${c2}]++`,
              16, 11, 20, 21, true, i, j, w1, w2, c1
            );
          }
          found = true;
          makeSnapshot(`Edge established. Stop comparing characters for this pair.`, "BREAK character loop", 19, 13, 23, 23, false, i, j, w1, w2);
          break;
        }
      }

      if (!found && w1.length > w2.length) {
        makeSnapshot(
          `Invalid dictionary order! "${w1}" has prefix "${w2}" but is longer. Return empty string.`,
          `IF w1 has prefix w2 AND len(w1) > len(w2) → RETURN ""`,
          23, 6, 14, 15, true, i, null, w1, w2
        );
        return { steps: stepsList, stepLineNumbers: stepLines };
      }
    }

    // Roots
    for (const [char, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(char);
      }
    }
    makeSnapshot("Enqueue all characters with 0 in-degree (no dependencies).", "FOR c in inDegree IF degree == 0 → enqueue(c)", 25, 15, 25, 27);

    // BFS
    while (queue.length > 0) {
      const char = queue.shift()!;
      result += char;
      count++;

      makeSnapshot(
        `Pop character '${char}' from queue. Add to sorted result and increment visited count.`,
        `DEQUEUE '${char}' & result += '${char}'`,
        30, 18, 35, 32, true, null, null, null, null, char
      );

      const neighbors = adj.get(char) || [];
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        const nextDegree = inDegree.get(neighbor)!;

        makeSnapshot(
          `Decrement in-degree of neighbor '${neighbor}' to ${nextDegree}.`,
          `inDegree[${neighbor}]-- → ${nextDegree}`,
          33, 20, 37, 34, false, null, null, null, null, neighbor
        );

        if (nextDegree === 0) {
          queue.push(neighbor);
          makeSnapshot(
            `In-degree of neighbor '${neighbor}' reached 0. Add it to the queue.`,
            `IF inDegree[${neighbor}] == 0 → enqueue(${neighbor})`,
            34, 22, 38, 35, true, null, null, null, null, neighbor
          );
        }
      }
    }

    const isValid = result.length === inDegree.size;
    makeSnapshot(
      `Topological sort finished. Visited ${result.length} characters of ${inDegree.size} unique characters. Is it valid? ${isValid ? "YES" : "NO"}`,
      `RETURN result.length == size ? result : ""`,
      39, 23, 42, 38, true, null, null, null, null, null
    );

    return { steps: stepsList, stepLineNumbers: stepLines };
  }, []);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden relative">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
              Alien Dictionary Words
            </h3>
            <div className="flex flex-col gap-1.5 w-full max-w-[220px] mx-auto border-l-2 border-primary/20 pl-4 py-2 relative">
              {step?.words.map((word, wIdx) => {
                const isActivePair = step.i !== null && (wIdx === step.i || wIdx === step.i + 1);
                return (
                  <div key={wIdx} className={`font-mono text-sm px-2 py-1 rounded transition-colors flex gap-1 ${isActivePair ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground/60"}`}>
                    {word.split('').map((ch, charIdx) => {
                      const isComparing = isActivePair && step.j === charIdx;
                      const isMismatch = isComparing && step.isMatch;
                      return (
                        <div key={charIdx} className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                          isMismatch ? 'bg-red-500/20 border-red-500 text-red-600 font-bold' : 
                          isComparing ? 'bg-blue-500/20 border-blue-500 text-blue-600' : 
                          'border-transparent'
                        }`}>
                          {ch}
                        </div>
                      )
                    })}
                  </div>
                );
              })}
              {step?.i !== null && (
                <div 
                  className="absolute left-[-2px] w-1 h-16 bg-primary transition-all duration-300"
                  style={{ top: `${(step.i * 34) + 12}px` }}
                />
              )}
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm min-h-[160px]">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">
                  In-Degree Constraints
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {step?.inDegree && Object.entries(step.inDegree).map(([char, degree]) => (
                    <div key={char} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold font-mono transition-all duration-300 ${
                        step.currentChar === char ? 'scale-110 ring-2 ring-primary z-10' : ''
                      } ${
                        degree === 0 ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/40' : 
                        'bg-muted/50 border border-border text-foreground/75'
                      }`}>
                        {char}
                      </div>
                      <span className={`text-[10px] mt-1 font-mono font-bold ${degree === 0 ? 'text-green-600' : 'text-muted-foreground'}`}>{degree}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-l border-border/30 pl-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center">
                  Graph (Adjacency)
                </h3>
                <div className="flex flex-col gap-2 pb-2 text-xs justify-center">
                  {step?.adj && Object.entries(step.adj).map(([char, neighbors]) => (
                    <div key={char} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center font-bold bg-primary/10 text-primary border border-primary/20">
                        {char}
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <div className="flex gap-1 flex-wrap">
                        {neighbors.length === 0 && <span className="text-muted-foreground text-[10px] italic">none</span>}
                        {neighbors.map((n, idx) => (
                          <div key={idx} className="w-5 h-5 rounded flex items-center justify-center font-bold bg-accent text-accent-foreground border border-border">
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

          {/* Commentary Panel */}
          <Card className="p-6 bg-card border-border/50 shadow-sm relative overflow-hidden transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  {step?.isMatch ? <CheckCircle2 className="w-4.5 h-4.5 text-primary" /> : <Info className="w-4.5 h-4.5 text-primary" />}
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {step?.explanation || ''}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <VariablePanel
            variables={{
              queue: step?.queue ? `[${step.queue.join(', ')}]` : '[]',
              result: step?.result ? `"${step.result}"` : '""',
              count: step?.count || 0
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
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
