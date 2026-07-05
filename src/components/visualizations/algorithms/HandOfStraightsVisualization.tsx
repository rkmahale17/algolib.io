import { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface CardObj {
  id: number;
  val: number;
  used: boolean;
}

interface Step {
  availableCards: CardObj[];
  groups: number[][];
  currentGroup: number[];
  activeCardVal: number | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

interface TestCase {
  id: string;
  name: string;
  hand: number[];
  groupSize: number;
  expected: boolean;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Valid Hand', hand: [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize: 3, expected: true },
  { id: 'ex2', name: 'Invalid Hand (Divisible)', hand: [1, 2, 3, 1, 2, 4], groupSize: 3, expected: false },
  { id: 'ex3', name: 'Invalid Hand (Not Divisible)', hand: [1, 2, 3, 4, 5], groupSize: 4, expected: false }
];

const languages: VisualizationLanguageMap = {
  typescript: `function isNStraightHand(hand: number[], groupSize: number): boolean {
  if (hand.length % groupSize !== 0) {
    return false;
  }
  const count = new Map<number, number>();
  for (const num of hand) {
    count.set(num, (count.get(num) || 0) + 1);
  }
  const sortedKeys = Array.from(count.keys()).sort((a, b) => a - b);
  for (const first of sortedKeys) {
    while ((count.get(first) || 0) > 0) {
      for (let i = first; i < first + groupSize; i++) {
        const freq = count.get(i) || 0;
        if (freq === 0) {
          return false;
        }
        count.set(i, freq - 1);
      }
    }
  }
  return true;
}`,
  python: `from collections import Counter

def isNStraightHand(hand: list[int], groupSize: int) -> bool:
    n = len(hand)
    if n % groupSize != 0:
        return False
    count = Counter(hand)
    sorted_keys = sorted(count.keys())
    for first in sorted_keys:
        while count[first] > 0:
            for i in range(first, first + groupSize):
                if count[i] == 0:
                    return False
                count[i] -= 1
    return True`,
  java: `public static class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) {
            return false;
        }
        TreeMap<Integer, Integer> counts = new TreeMap<>();
        for (int card : hand) {
            counts.put(card, counts.getOrDefault(card, 0) + 1);
        }
        while (!counts.isEmpty()) {
            int firstCard = counts.firstKey();
            for (int i = 0; i < groupSize; i++) {
                int currentCard = firstCard + i;
                if (!counts.containsKey(currentCard)) {
                    return false;
                }
                int freq = counts.get(currentCard);
                if (freq == 1) {
                    counts.remove(currentCard);
                } else {
                    counts.put(currentCard, freq - 1);
                }
            }
        }
        return true;
    }
}`,
  cpp: `class Solution {
public:
    bool isNStraightHand(vector<int>& hand, int groupSize) {
        int n = hand.size();
        if (n % groupSize != 0) {
            return false;
        }
        map<int, int> count;
        for (int card : hand) {
            count[card]++;
        }
        for (auto const& [first_card, freq] : count) {
            if (freq > 0) {
                int num_straights_to_form = freq; 
                for (int i = 0; i < groupSize; i++) {
                    int card_to_find = first_card + i;
                    if (count.find(card_to_find) == count.end() || count[card_to_find] < num_straights_to_form) {
                        return false;
                    }
                    count[card_to_find] -= num_straights_to_form;
                }
            }
        }
        return true;
    }
};`
};

export const HandOfStraightsVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const { steps, stepLineNumbers } = useMemo(() => {
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const hand = selectedTestCase.hand;
    const groupSize = selectedTestCase.groupSize;
    let availableCards: CardObj[] = hand.map((val, idx) => ({ id: idx, val, used: false })).sort((a, b) => a.val - b.val);
    
    let groups: number[][] = [];
    let currentGroup: number[] = [];

    const addStep = (
      explanation: string,
      pseudo: string,
      variables: Record<string, any>,
      activeCardVal: number | null,
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        availableCards: availableCards.map(c => ({ ...c })),
        groups: [...groups.map(g => [...g])],
        currentGroup: [...currentGroup],
        activeCardVal,
        explanation,
        pseudoStep: pseudo,
        variables: { ...variables }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    let vars: Record<string, any> = { hand: `[${hand.join(', ')}]`, groupSize };
    
    addStep(
      `Let's help Alice check if she can group her ${hand.length} cards into groups of ${groupSize}. Are there enough cards?`,
      `isNStraightHand(hand, groupSize=${groupSize})`,
      vars,
      null,
      1, 3, 2, 3
    );

    if (hand.length % groupSize !== 0) {
      addStep(
        `Oh no! ${hand.length} is not perfectly divisible by ${groupSize}. We can't form the groups. Return false.`,
        "RETURN False",
        vars,
        null,
        3, 6, 4, 6
      );
      return { steps: newSteps, stepLineNumbers: lines };
    }

    addStep(
      "Let's create a counts map to store the frequencies of each card value.",
      "SET count = Counter(hand)",
      vars,
      null,
      5, 7, 6, 8
    );
    
    const count = new Map<number, number>();
    vars.count = "{}";
    
    for (const num of hand) {
        count.set(num, (count.get(num) || 0) + 1);
        vars.count = JSON.stringify(Object.fromEntries(count));
        addStep(
          `Counting the cards! We found a '${num}'.`,
          `counts.add(${num})`,
          vars,
          num,
          7, 7, 8, 10
        );
    }

    const sortedKeys = Array.from(count.keys()).sort((a, b) => a - b);
    vars.sortedKeys = JSON.stringify(sortedKeys);
    addStep(
      "To build groups of consecutive cards, we must always start with the smallest cards. So we sort our unique cards.",
      "SET sorted_keys = sorted(count.keys())",
      vars,
      null,
      9, 8, 10, 12
    );

    for (const first of sortedKeys) {
        vars.first = first;
        addStep(
          `Let's look at the smallest available card we haven't finished with: ${first}.`,
          `FOR first IN sorted_keys  →  first = ${first}`,
          vars,
          first,
          10, 9, 10, 12
        );
        
        while ((count.get(first) || 0) > 0) {
            addStep(
              `We have at least one '${first}', so let's try to build a group of ${groupSize} consecutive cards starting with it!`,
              `WHILE count[${first}] > 0`,
              vars,
              first,
              11, 10, 10, 13
            );
            currentGroup = [];
            
            for (let i = first; i < first + groupSize; i++) {
                vars.i = i;
                addStep(
                  `We need the card '${i}' to continue our consecutive sequence.`,
                  `FOR i FROM ${first} TO ${first + groupSize - 1}  →  i = ${i}`,
                  vars,
                  i,
                  12, 11, 12, 15
                );
                
                const freq = count.get(i) || 0;
                vars.freq = freq;
                
                if (freq === 0) {
                    addStep(
                      `Oh no! We need a '${i}' to make the cards consecutive, but we don't have any left.`,
                      `IF count[${i}] == 0  →  True`,
                      vars,
                      i,
                      14, 12, 14, 17
                    );
                    addStep(
                      `Return false.`,
                      "RETURN False",
                      vars,
                      i,
                      15, 13, 15, 18
                    );
                    return { steps: newSteps, stepLineNumbers: lines };
                }

                count.set(i, freq - 1);
                vars.count = JSON.stringify(Object.fromEntries(count));
                
                const cardIndex = availableCards.findIndex(c => c.val === i && !c.used);
                if (cardIndex !== -1) {
                    availableCards[cardIndex].used = true;
                }
                
                currentGroup.push(i);
                
                addStep(
                  `Awesome! We use one '${i}' card and add it to our current group.`,
                  `SET count[${i}] -= 1`,
                  vars,
                  i,
                  17, 14, 21, 20
                );
            }
            groups.push([...currentGroup]);
            currentGroup = [];
            addStep(
              `Yay! We successfully built a group of ${groupSize} consecutive cards!`,
              "// Finished consecutive group",
              vars,
              null,
              19, 14, 23, 21
            );
        }
    }

    addStep(
      `All of Alice's cards have been perfectly placed into consecutive groups! Return true.`,
      "RETURN True",
      vars,
      null,
      21, 15, 25, 24
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [selectedTestCaseId]);

  if (steps.length === 0 || !Array.isArray(steps[0].availableCards)) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          Test Cases
        </h3>
        <div className="flex gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tc.expected ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {tc.name}
            </button>
          ))}
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-xl border-2 border-primary/20 p-6 flex flex-col gap-6 items-center">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                ✨ Alice's Cards ✨
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {step.availableCards.map((cardObj) => (
                  <div 
                    key={cardObj.id} 
                    className={`flex flex-col items-center gap-2 transition-all duration-300 ${cardObj.val === step.activeCardVal && !cardObj.used ? 'scale-110' : ''} ${cardObj.used ? 'opacity-20 scale-90 grayscale' : ''}`}
                  >
                    <div className={`relative w-8 h-8 rounded-md flex items-center justify-center border-2 shadow-sm ${cardObj.val === step.activeCardVal && !cardObj.used ? 'bg-primary/20 border-primary shadow-primary/30' : 'bg-card border-border'}`}>
                      <span className="text-xs font-bold text-foreground">{cardObj.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {(step.groups.length > 0 || step.currentGroup.length > 0) && (
                <div className="w-full mt-4 pt-6 border-t-2 border-dashed border-border/50 flex flex-col items-center">
                   <h3 className="text-lg font-bold text-foreground/80 mb-4">🌟 Consecutive Groups Built 🌟</h3>
                   <div className="flex flex-wrap justify-center gap-6">
                      {step.groups.map((group, gIdx) => (
                        <div key={gIdx} className="flex gap-1 p-3 bg-green-500/10 rounded-xl border-2 border-green-500/30 shadow-inner">
                          {group.map((c, cIdx) => (
                             <div key={cIdx} className="w-8 h-8 bg-green-500/20 rounded-md flex items-center justify-center border-2 border-green-500/40 font-bold text-green-700 dark:text-green-400 text-xs">
                               {c}
                             </div>
                          ))}
                        </div>
                      ))}
                      {step.currentGroup.length > 0 && (
                        <div className="flex gap-1 p-3 bg-yellow-500/10 rounded-xl border-2 border-yellow-500/30 border-dashed animate-pulse">
                          {step.currentGroup.map((c, cIdx) => (
                             <div key={cIdx} className="w-8 h-8 bg-yellow-500/20 rounded-md flex items-center justify-center border-2 border-yellow-500/40 font-bold text-yellow-700 dark:text-yellow-400 text-xs">
                               {c}
                             </div>
                          ))}
                        </div>
                      )}
                   </div>
                </div>
              )}
            </div>

            <Card className="p-4 bg-primary/5 border border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
            </Card>
            <VariablePanel variables={step.variables} />
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
    </div>
  );
};
export default HandOfStraightsVisualization;
