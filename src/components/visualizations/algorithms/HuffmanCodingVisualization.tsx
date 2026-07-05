import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface HuffmanNode {
  char: string;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  id: string;
}

interface Step {
  freqMap: Record<string, number>;
  heap: HuffmanNode[];
  activeIds: string[];
  codes: Record<string, string>;
  message: string;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function huffmanEncoding(text: string): Map<string, string> {
  const freqMap = new Map<string, number>();
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1);
  }
  const heap: HuffmanNode[] = Array.from(freqMap.entries())
    .map(([char, freq]) => new HuffmanNode(char, freq));
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift()!;
    const right = heap.shift()!;
    const parent = new HuffmanNode('', left.freq + right.freq, left, right);
    heap.push(parent);
  }
  const codes = new Map<string, string>();
  function buildCodes(node: HuffmanNode | null, code: string): void {
    if (!node) return;
    if (!node.left && !node.right) {
      codes.set(node.char, code || '0');
      return;
    }
    buildCodes(node.left, code + '0');
    buildCodes(node.right, code + '1');
  }
  buildCodes(heap[0], '');
  return codes;
}
class HuffmanNode {
  constructor(
    public char: string,
    public freq: number,
    public left: HuffmanNode | null = null,
    public right: HuffmanNode | null = null
  ) {}
}`,

  python: `import heapq
def huffman_encoding(text):
    if not text:
        return {}
    freq_map = {}
    for char in text:
        freq_map[char] = freq_map.get(char, 0) + 1
    heap = [[freq, char] for char, freq in freq_map.items()]
    heapq.heapify(heap)
    while len(heap) > 1:
        freq1, char1 = heapq.heappop(heap)
        freq2, char2 = heapq.heappop(heap)
        merged_node = [freq1 + freq2, [char1, char2]]
        heapq.heappush(heap, merged_node)
    huffman_codes = {}
    def generate_codes(node, code):
        if isinstance(node[1], str):
            huffman_codes[node[1]] = code or '0'
            return
        generate_codes([node[0], node[1][0]], code + '0')
        generate_codes([node[0], node[1][1]], code + '1')
    generate_codes(heap[0], '')
    return huffman_codes`,

  java: `class HuffmanNode {
    char character;
    int frequency;
    HuffmanNode left;
    HuffmanNode right;
    HuffmanNode(char character, int frequency) {
        this.character = character;
        this.frequency = frequency;
        this.left = null;
        this.right = null;
    }
}
public static class Solution {
    public Map<Character, String> huffmanEncoding(String text) {
        Map<Character, Integer> frequencyMap = new HashMap<>();
        for (char c : text.toCharArray()) {
            frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
        }
        PriorityQueue<HuffmanNode> priorityQueue = new PriorityQueue<>(Comparator.comparingInt(node -> node.frequency));
        for (Map.Entry<Character, Integer> entry : frequencyMap.entrySet()) {
            priorityQueue.add(new HuffmanNode(entry.getKey(), entry.getValue()));
        }
        while (priorityQueue.size() > 1) {
            HuffmanNode left = priorityQueue.poll();
            HuffmanNode right = priorityQueue.poll();
            HuffmanNode parent = new HuffmanNode('\\0', left.frequency + right.frequency);
            parent.left = left;
            parent.right = right;
            priorityQueue.add(parent);
        }
        HuffmanNode root = priorityQueue.poll();
        Map<Character, String> huffmanCodes = new HashMap<>();
        buildHuffmanCodes(root, "", huffmanCodes);
        return huffmanCodes;
    }
    private void buildHuffmanCodes(HuffmanNode node, String code, Map<Character, String> huffmanCodes) {
        if (node == null) {
            return;
        }
        if (node.left == null && node.right == null) {
            huffmanCodes.put(node.character, code.isEmpty() ? "0" : code);
            return;
        }
        buildHuffmanCodes(node.left, code + "0", huffmanCodes);
        buildHuffmanCodes(node.right, code + "1", huffmanCodes);
    }
}`,

  cpp: `struct HuffmanNode {
    char ch;
    int freq;
    HuffmanNode *left, *right;
    HuffmanNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};
struct Compare {
    bool operator()(HuffmanNode* a, HuffmanNode* b) {
        return a->freq > b->freq;
    }
};
map<char, string> huffmanEncoding(string text) {
    map<char, int> freqMap;
    for (char c : text) freqMap[c]++;
    priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> minHeap;
    for (auto [ch, freq] : freqMap) {
        minHeap.push(new HuffmanNode(ch, freq));
    }
    while (minHeap.size() > 1) {
        auto left = minHeap.top(); minHeap.pop();
        auto right = minHeap.top(); minHeap.pop();
        auto parent = new HuffmanNode('\\0', left->freq + right->freq);
        parent->left = left;
        parent->right = right;
        minHeap.push(parent);
    }
    map<char, string> codes;
    function<void(HuffmanNode*, string)> buildCodes = [&](HuffmanNode* node, string code) {
        if (!node) return;
        if (!node->left && !node->right) {
            codes[node->ch] = code.empty() ? "0" : code;
            return;
        }
        buildCodes(node->left, code + "0");
        buildCodes(node->right, code + "1");
    };
    buildCodes(minHeap.top(), "");
    return codes;
}`
};

function generateVisualizationData() {
  const text = 'ABRACADABRA';
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  steps.push({
    freqMap: {},
    heap: [],
    activeIds: [],
    codes: {},
    message: `Start with text: "${text}". Calculate frequencies of each character.`,
    explanation: 'Count the occurrence of each unique character in the string.',
    pseudoStep: `START huffmanEncoding(text="${text}")`,
  });
  addLines(1, 2, 14, 12);

  const freqMap: Record<string, number> = {};
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  steps.push({
    freqMap: { ...freqMap },
    heap: [],
    activeIds: [],
    codes: {},
    message: 'Finished counting character frequencies.',
    explanation: `Frequency Map built: A:${freqMap.A}, B:${freqMap.B}, R:${freqMap.R}, C:${freqMap.C}, D:${freqMap.D}.`,
    pseudoStep: `SET freqMap = ${JSON.stringify(freqMap)}`,
  });
  addLines(3, 7, 16, 14);

  const nodes: HuffmanNode[] = Object.entries(freqMap).map(([char, freq]) => ({
    char,
    freq,
    left: null,
    right: null,
    id: `leaf-${char}`
  }));

  steps.push({
    freqMap: { ...freqMap },
    heap: [...nodes],
    activeIds: [],
    codes: {},
    message: 'Create leaf nodes and add them to priority queue (heap).',
    explanation: 'Wrap each character and frequency in a HuffmanNode, initializing the priority queue.',
    pseudoStep: 'SET heap = map(freqMap) to HuffmanNodes',
  });
  addLines(6, 8, 19, 15);

  let heap = [...nodes];
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);

    steps.push({
      freqMap: { ...freqMap },
      heap: heap.map((n) => ({ ...n })),
      activeIds: [],
      codes: {},
      message: 'Sort queue to bring nodes with the lowest frequencies to the front.',
      explanation: 'Priority queue sort by frequency ascending to greedily retrieve the two least frequent nodes.',
      pseudoStep: 'SORT heap BY freq ASC',
    });
    addLines(9, 10, 23, 19);

    const left = heap.shift()!;
    const right = heap.shift()!;

    steps.push({
      freqMap: { ...freqMap },
      heap: [left, right, ...heap].map((n) => ({ ...n })),
      activeIds: [left.id, right.id],
      codes: {},
      message: `Extract two smallest: '${left.char || 'node'}' (${left.freq}) and '${right.char || 'node'}' (${right.freq}).`,
      explanation: `Dequeue the two nodes with minimal frequencies: left: ${left.char || 'internal'}(${left.freq}), right: ${right.char || 'internal'}(${right.freq}).`,
      pseudoStep: `EXTRACT MIN left, right FROM heap`,
    });
    addLines(10, 11, 24, 20);

    const parent: HuffmanNode = {
      char: '',
      freq: left.freq + right.freq,
      left,
      right,
      id: `node-${left.id}-${right.id}`
    };

    heap.push(parent);

    steps.push({
      freqMap: { ...freqMap },
      heap: heap.map((n) => ({ ...n })),
      activeIds: [parent.id],
      codes: {},
      message: `Create parent with sum frequency ${parent.freq} and push back to heap.`,
      explanation: `Build internal parent node with frequency ${parent.freq} (left.freq + right.freq).`,
      pseudoStep: `INSERT parent(${parent.freq}) with left, right into heap`,
    });
    addLines(12, 13, 26, 22);
  }

  const codes: Record<string, string> = {};
  const traverse = (node: HuffmanNode | null, code: string) => {
    if (!node) return;

    steps.push({
      freqMap: { ...freqMap },
      heap: [...heap],
      activeIds: [node.id],
      codes: { ...codes },
      message: `Visit node '${node.char || 'internal'}'. Path code: ${code || 'root'}`,
      explanation: `Traverse the tree recursively. Current path code is '${code || 'root'}'.`,
      pseudoStep: `buildCodes(node='${node.char || 'internal'}', code='${code}')`,
    });
    addLines(16, 16, 36, 28);

    if (!node.left && !node.right) {
      codes[node.char] = code || '0';
      steps.push({
        freqMap: { ...freqMap },
        heap: [...heap],
        activeIds: [node.id],
        codes: { ...codes },
        message: `Leaf reached! Code for '${node.char}' = ${codes[node.char]}`,
        explanation: `Leaf node '${node.char}' reached. Assign its path string '${codes[node.char]}' as its Huffman encoding code.`,
        pseudoStep: `SET codes['${node.char}'] = '${code}'`,
      });
      addLines(19, 18, 41, 31);
      return;
    }

    traverse(node.left, code + '0');
    traverse(node.right, code + '1');
  };

  traverse(heap[0], '');

  steps.push({
    freqMap: { ...freqMap },
    heap: [...heap],
    activeIds: [],
    codes: { ...codes },
    message: 'Huffman codes generated successfully!',
    explanation: 'Tree traversal complete. Return map of character-to-binary-code mappings.',
    pseudoStep: 'RETURN codes',
  });
  addLines(26, 23, 34, 38);

  return { steps, stepLineNumbers };
}

export const HuffmanCodingVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  const renderTree = (
    node: HuffmanNode | null,
    x: number,
    y: number,
    offset: number,
    depth: number = 0
  ): JSX.Element | null => {
    if (!node) return null;

    const isActive = currentStep.activeIds.includes(node.id);

    return (
      <g key={node.id}>
        {node.left && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x - offset}
              y2={y + 50}
              className={`stroke-2 transition-all duration-300 ${
                isActive ? 'stroke-primary' : 'stroke-muted-foreground/30'
              }`}
            />
            <text x={x - offset / 2 - 5} y={y + 25} className="text-[8px] fill-muted-foreground font-mono">
              0
            </text>
            {renderTree(node.left, x - offset, y + 50, offset / 1.8, depth + 1)}
          </>
        )}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y}
              x2={x + offset}
              y2={y + 50}
              className={`stroke-2 transition-all duration-300 ${
                isActive ? 'stroke-primary' : 'stroke-muted-foreground/30'
              }`}
            />
            <text x={x + offset / 2 + 5} y={y + 25} className="text-[8px] fill-muted-foreground font-mono">
              1
            </text>
            {renderTree(node.right, x + offset, y + 50, offset / 1.8, depth + 1)}
          </>
        )}
        <circle
          cx={x}
          cy={y}
          r={18}
          className={`transition-all duration-300 ${
            isActive
              ? 'fill-primary/20 stroke-primary'
              : node.char
              ? 'fill-muted/50 stroke-border'
              : 'fill-accent/40 stroke-border'
          } stroke-2`}
        />
        <text
          x={x}
          y={y - 2}
          textAnchor="middle"
          className={`text-[10px] font-mono font-bold ${
            isActive ? 'fill-primary font-black' : 'fill-foreground'
          }`}
        >
          {node.char || '∑'}
        </text>
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          className={`text-[8px] font-mono ${
            isActive ? 'fill-primary font-bold' : 'fill-muted-foreground'
          }`}
        >
          {node.freq}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border/50 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-foreground border-b border-primary/20 pb-2">
              Huffman Tree Workspace
            </h3>

            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border/40">
              <div className="bg-muted/30 p-3 rounded-xl border border-border/50 flex-1 min-w-[150px]">
                <h4 className="text-[10px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">
                  Frequency Map
                </h4>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {Object.entries(currentStep.freqMap).map(([char, freq]) => (
                    <div
                      key={char}
                      className="bg-secondary px-2 py-1 rounded border border-border flex gap-2 items-center"
                    >
                      <span className="font-bold text-foreground font-mono">{char}</span>
                      <span className="text-muted-foreground">× {freq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {Object.keys(currentStep.codes).length > 0 && (
                <div className="bg-primary/5 p-3 rounded-xl border border-primary/20 flex-1 min-w-[150px]">
                  <h4 className="text-[10px] font-bold mb-2 text-primary uppercase tracking-wider">
                    Generated Codes
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {Object.entries(currentStep.codes).map(([char, code]) => (
                      <div key={char} className="flex gap-2 items-center">
                        <span className="font-bold text-foreground font-mono">{char}:</span>
                        <span className="text-primary font-mono font-bold">{code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full overflow-x-auto min-h-[350px] flex items-center justify-center bg-muted/10 rounded-xl border border-dashed border-border/40 p-4">
              <svg
                width={Math.max(500, currentStep.heap.length * 120)}
                height="320"
                viewBox={`0 0 ${Math.max(500, currentStep.heap.length * 120)} 320`}
              >
                {/* Horizontal guide for heap */}
                <line
                  x1="0"
                  y1="290"
                  x2="100%"
                  y2="290"
                  className="stroke-border stroke-1 stroke-dasharray-4"
                />

                {currentStep.heap.map((root, idx) => {
                  const xOffset =
                    (Math.max(500, currentStep.heap.length * 120) / (currentStep.heap.length + 1)) *
                    (idx + 1);
                  return (
                    <g key={root.id}>
                      <text
                        x={xOffset}
                        y={310}
                        textAnchor="middle"
                        className="text-[8px] font-mono fill-muted-foreground uppercase"
                      >
                        Tree {idx + 1}
                      </text>
                      {renderTree(root, xOffset, 40, currentStep.heap.length > 3 ? 40 : 80)}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
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
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Code Display and Variables */}
        <div className="lg:col-span-5 space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              nodes_in_heap: currentStep.heap.length,
              phase:
                currentStepIndex < 2
                  ? 'Frequencies'
                  : currentStep.heap.length > 1
                  ? 'Building Tree'
                  : 'Codes Generation',
              chars_encoded: Object.keys(currentStep.codes).length
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HuffmanCodingVisualization;
