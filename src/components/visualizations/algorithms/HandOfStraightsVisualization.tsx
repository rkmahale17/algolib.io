import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  lineNumber: number;
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

export const HandOfStraightsVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function isNStraightHand(hand: number[], groupSize: number): boolean {
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
}`;

  const generateSteps = useCallback(() => {
    const newSteps: Step[] = [];
    const hand = selectedTestCase.hand;
    const groupSize = selectedTestCase.groupSize;
    let availableCards: CardObj[] = hand.map((val, idx) => ({ id: idx, val, used: false })).sort((a, b) => a.val - b.val);
    
    let groups: number[][] = [];
    let currentGroup: number[] = [];

    const addStep = (explanation: string, lineNumber: number, variables: Record<string, any>, activeCardVal: number | null = null) => {
      newSteps.push({
        availableCards: availableCards.map(c => ({ ...c })),
        groups: [...groups.map(g => [...g])],
        currentGroup: [...currentGroup],
        activeCardVal,
        explanation,
        lineNumber,
        variables: { ...variables }
      });
    };

    let vars: Record<string, any> = { hand: `[${hand.join(', ')}]`, groupSize };
    
    // Line 2
    addStep(`Let's help Alice check if she can group her ${hand.length} cards into groups of ${groupSize}. Are there enough cards?`, 2, vars);

    if (hand.length % groupSize !== 0) {
      addStep(`Oh no! ${hand.length} is not perfectly divisible by ${groupSize}. We can't form the groups. Return false.`, 3, vars);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      return;
    }

    // Line 6
    addStep("Let's create a magic box to count how many of each card Alice has.", 6, vars);
    
    const count = new Map<number, number>();
    vars.count = "{}";
    
    // Line 7
    addStep("We'll look at each card in Alice's hand and count them one by one.", 7, vars);
    
    for (const num of hand) {
        count.set(num, (count.get(num) || 0) + 1);
        vars.count = JSON.stringify(Object.fromEntries(count));
        addStep(`Counting the cards! We found a '${num}'.`, 8, vars, num);
    }
    
    addStep("We've counted all of Alice's cards! Now we know exactly what she has.", 9, vars);

    // Line 11
    const sortedKeys = Array.from(count.keys()).sort((a, b) => a - b);
    vars.sortedKeys = JSON.stringify(sortedKeys);
    addStep("To build groups of consecutive cards, we must always start with the smallest cards. So we sort our unique cards from smallest to largest.", 11, vars);

    // Line 13
    for (const first of sortedKeys) {
        vars.first = first;
        addStep(`Let's look at the smallest available card we haven't finished with: ${first}.`, 13, vars, first);
        
        // Line 14
        while ((count.get(first) || 0) > 0) {
            addStep(`We have at least one '${first}', so let's try to build a group of ${groupSize} consecutive cards starting with it!`, 14, vars, first);
            currentGroup = [];
            
            // Line 15
            for (let i = first; i < first + groupSize; i++) {
                vars.i = i;
                addStep(`We need the card '${i}' to continue our consecutive sequence.`, 15, vars, i);
                
                const freq = count.get(i) || 0;
                vars.freq = freq;
                
                // Line 16
                addStep(`Checking how many '${i}' cards we have... We have ${freq}.`, 16, vars, i);

                // Line 18
                if (freq === 0) {
                    addStep(`Oh no! We need a '${i}' to make the cards consecutive, but we don't have any left. Alice can't finish her groups!`, 18, vars, i);
                    addStep(`Return false.`, 19, vars, i);
                    setSteps(newSteps);
                    setCurrentStepIndex(0);
                    return;
                }

                // Line 22
                count.set(i, freq - 1);
                vars.count = JSON.stringify(Object.fromEntries(count));
                
                // Mark one physical card as used visually
                const cardIndex = availableCards.findIndex(c => c.val === i && !c.used);
                if (cardIndex !== -1) {
                    availableCards[cardIndex].used = true;
                }
                
                currentGroup.push(i);
                
                addStep(`Awesome! We use one '${i}' card and add it to our current group.`, 22, vars, i);
            }
            groups.push([...currentGroup]);
            currentGroup = [];
            addStep(`Yay! We successfully built a group of ${groupSize} consecutive cards!`, 23, vars);
        }
        addStep(`We ran out of '${first}' cards. Time to move to the next smallest card.`, 24, vars, first);
    }

    addStep(`All of Alice's cards have been perfectly placed into consecutive groups! Return true.`, 27, vars);

    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [selectedTestCase]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0 || !Array.isArray(steps[0].availableCards)) return null;

  const currentStep = steps[currentStepIndex];

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
                setIsPlaying(false);
                setCurrentStepIndex(0);
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
          <div className="bg-muted/30 rounded-xl border-2 border-primary/20 p-6 flex flex-col gap-6 items-center">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              ✨ Alice's Cards ✨
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {currentStep.availableCards.map((cardObj) => (
                <div 
                  key={cardObj.id} 
                  className={`flex flex-col items-center gap-2 transition-all duration-300 ${cardObj.val === currentStep.activeCardVal && !cardObj.used ? 'scale-110' : ''} ${cardObj.used ? 'opacity-20 scale-90 grayscale' : ''}`}
                >
                  <div className={`relative w-12 h-16 sm:w-14 sm:h-20 rounded-md flex items-center justify-center border-2 shadow-md ${cardObj.val === currentStep.activeCardVal && !cardObj.used ? 'bg-primary/20 border-primary shadow-primary/30' : 'bg-card border-border'}`}>
                    <span className="text-xl sm:text-2xl font-bold text-foreground">{cardObj.val}</span>
                  </div>
                </div>
              ))}
            </div>

            {(currentStep.groups.length > 0 || currentStep.currentGroup.length > 0) && (
              <div className="w-full mt-4 pt-6 border-t-2 border-dashed border-border/50 flex flex-col items-center">
                 <h3 className="text-lg font-bold text-foreground/80 mb-4">🌟 Consecutive Groups Built 🌟</h3>
                 <div className="flex flex-wrap justify-center gap-6">
                    {currentStep.groups.map((group, gIdx) => (
                      <div key={gIdx} className="flex gap-1 p-3 bg-green-500/10 rounded-xl border-2 border-green-500/30 shadow-inner">
                        {group.map((c, cIdx) => (
                           <div key={cIdx} className="w-8 h-12 bg-green-500/20 rounded-md flex items-center justify-center border-2 border-green-500/40 font-bold text-green-700 dark:text-green-400 text-sm">
                             {c}
                           </div>
                        ))}
                      </div>
                    ))}
                    {currentStep.currentGroup.length > 0 && (
                      <div className="flex gap-1 p-3 bg-yellow-500/10 rounded-xl border-2 border-yellow-500/30 border-dashed animate-pulse">
                        {currentStep.currentGroup.map((c, cIdx) => (
                           <div key={cIdx} className="w-8 h-12 bg-yellow-500/20 rounded-md flex items-center justify-center border-2 border-yellow-500/40 font-bold text-yellow-700 dark:text-yellow-400 text-sm">
                             {c}
                           </div>
                        ))}
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-base sm:text-lg font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
