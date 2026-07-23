import { useState } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { Card } from '@/components/ui/card';

interface Step {
  nums: number[];
  i: number | null;
  candidates: { val: number; count: number }[];
  verifiedCandidates: { val: number; freq: number; status: 'pending' | 'verified' | 'failed' }[];
  cancellationActive: boolean;
  phase: 'selection' | 'verification' | 'finished';
  activeVerifyKey: number | null;
  activeVerifyIdx: number | null;
  result: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function majorityElement(nums: number[]): number[] {
    const count = new Map<number, number>();
    for (const num of nums) {
        count.set(num, (count.get(num) ?? 0) + 1);
        if (count.size > 2) {
            const newCount = new Map<number, number>();
            for (const [key, value] of count.entries()) {
                if (value > 1) {
                    newCount.set(key, value - 1);
                }
            }
            count.clear();
            for (const [key, value] of newCount.entries()) {
                count.set(key, value);
            }
        }
    }
    const result: number[] = [];
    for (const key of count.keys()) {
        let frequency = 0;
        for (const num of nums) {
            if (num === key) {
                frequency++;
            }
        }
        if (frequency > Math.floor(nums.length / 3)) {
            result.push(key);
        }
    }
    return result;
}`,

  python: `def majorityElement(nums: list[int]) -> list[int]:
    count = {}
    for num in nums:
        count[num] = count.get(num, 0) + 1
        if len(count) > 2:
            new_count = {}
            for key, value in count.items():
                if value > 1:
                    new_count[key] = value - 1
            count.clear()
            for key, value in new_count.items():
                count[key] = value
    result = []
    n = len(nums)
    threshold = n // 3
    for key in count.keys():
        frequency = 0
        for num in nums:
            if num == key:
                frequency += 1
        if frequency > threshold:
            result.append(key)
    return result`,

  java: `public List<Integer> majorityElement(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
        if (count.size() > 2) {
            Map<Integer, Integer> newCount = new HashMap<>();
            for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
                if (entry.getValue() > 1) { 
                    newCount.put(entry.getKey(), entry.getValue() - 1);
                }
            }
            count.clear();
            count.putAll(newCount); 
        }
    }
    List<Integer> result = new ArrayList<>();
    int n = nums.length;
    for (int key : count.keySet()) {
        int frequency = 0;
        for (int num : nums) {
            if (num == key) {
                frequency++;
            }
        }
        if (frequency > n / 3) {
            result.add(key);
        }
    }
    return result;
}`,

  cpp: `vector<int> majorityElement(vector<int>& nums) {
    unordered_map<int, int> count;
    for (int num : nums) {
        count[num]++; 
        if (count.size() > 2) {
            unordered_map<int, int> newCount;
            for (auto const& pair : count) {
                int key = pair.first;
                int value = pair.second;
                if (value > 1) {
                    newCount[key] = value - 1;
                }
            }
            count.swap(newCount);
        }
    }
    vector<int> result;
    int threshold = nums.size() / 3; 
    for (auto const& pair : count) {
        int candidateKey = pair.first;
        int frequency = 0;
        for (int num : nums) {
            if (num == candidateKey) {
                frequency++;
            }
        }
        if (frequency > threshold) {
            result.push_back(candidateKey);
        }
    }
    return result;
}`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const nums = [3, 2, 3, 2, 1, 2, 3];
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

  const activeCounts = new Map<number, number>();

  // Init Step
  steps.push({
    nums,
    i: null,
    candidates: [],
    verifiedCandidates: [],
    cancellationActive: false,
    phase: 'selection',
    activeVerifyKey: null,
    activeVerifyIdx: null,
    result: [],
    variables: { candidates: '{}', phase: 'Selection', i: '-', num: '-' },
    explanation: 'Initialize an empty map "count" to track at most 2 candidate elements.',
    pseudoStep: 'SET count = {}'
  });
  addLines(2, 2, 2, 2);

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Loop header
    steps.push({
      nums,
      i,
      candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
      verifiedCandidates: [],
      cancellationActive: false,
      phase: 'selection',
      activeVerifyKey: null,
      activeVerifyIdx: null,
      result: [],
      variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Selection', i, num },
      explanation: `Read element nums[${i}] = ${num}.`,
      pseudoStep: `FOR each num IN nums: (num = ${num})`
    });
    addLines(3, 3, 3, 3);

    // Increment count
    activeCounts.set(num, (activeCounts.get(num) ?? 0) + 1);
    steps.push({
      nums,
      i,
      candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
      verifiedCandidates: [],
      cancellationActive: false,
      phase: 'selection',
      activeVerifyKey: null,
      activeVerifyIdx: null,
      result: [],
      variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Selection', i, num },
      explanation: `Increment count for ${num}. Candidates now: ${JSON.stringify(Object.fromEntries(activeCounts))}.`,
      pseudoStep: `SET count[${num}] = count[${num}] + 1`
    });
    addLines(4, 4, 4, 4);

    // Check size > 2
    const sizeOver = activeCounts.size > 2;
    steps.push({
      nums,
      i,
      candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
      verifiedCandidates: [],
      cancellationActive: false,
      phase: 'selection',
      activeVerifyKey: null,
      activeVerifyIdx: null,
      result: [],
      variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Selection', i, num },
      explanation: `Check if map has more than 2 candidates → ${sizeOver ? 'YES' : 'NO'}.`,
      pseudoStep: `IF count.size > 2 → ${sizeOver ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(5, 5, 5, 5);

    if (sizeOver) {
      // Decrement step
      const decremented: { val: number; count: number }[] = [];
      const newCounts = new Map<number, number>();
      
      for (const [key, value] of activeCounts.entries()) {
        if (value > 1) {
          newCounts.set(key, value - 1);
        }
        decremented.push({ val: key, count: value - 1 });
      }

      steps.push({
        nums,
        i,
        candidates: decremented,
        verifiedCandidates: [],
        cancellationActive: true,
        phase: 'selection',
        activeVerifyKey: null,
        activeVerifyIdx: null,
        result: [],
        variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Selection', i, num },
        explanation: `Cancellation! Decrement counts of all candidates by 1. Remove candidates whose count drops to 0.`,
        pseudoStep: 'DECREMENT all candidate counts'
      });
      addLines(9, 9, 9, 11);

      // Apply update
      activeCounts.clear();
      for (const [key, value] of newCounts.entries()) {
        activeCounts.set(key, value);
      }

      steps.push({
        nums,
        i,
        candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
        verifiedCandidates: [],
        cancellationActive: false,
        phase: 'selection',
        activeVerifyKey: null,
        activeVerifyIdx: null,
        result: [],
        variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Selection', i, num },
        explanation: `Candidates updated after cancellation. New candidates: ${JSON.stringify(Object.fromEntries(activeCounts))}.`,
        pseudoStep: 'SET count = new_count'
      });
      addLines(14, 12, 13, 14);
    }
  }

  // Phase transition to verification
  const candidatesList = Array.from(activeCounts.keys());
  const verifiedList: { val: number; freq: number; status: 'pending' | 'verified' | 'failed' }[] = candidatesList.map(val => ({
    val,
    freq: 0,
    status: 'pending'
  }));

  const result: number[] = [];
  const threshold = Math.floor(nums.length / 3);

  steps.push({
    nums,
    i: null,
    candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
    verifiedCandidates: [...verifiedList],
    cancellationActive: false,
    phase: 'verification',
    activeVerifyKey: null,
    activeVerifyIdx: null,
    result: [],
    variables: { candidates: JSON.stringify(Object.fromEntries(activeCounts)), phase: 'Verification', threshold },
    explanation: `Selection phase complete. Candidates are [${candidatesList.join(', ')}]. Now verifying counts against threshold n/3 = ${threshold}.`,
    pseudoStep: `SET result = [], threshold = ${threshold}`
  });
  addLines(18, 13, 16, 17);

  for (let cIdx = 0; cIdx < candidatesList.length; cIdx++) {
    const key = candidatesList[cIdx];

    steps.push({
      nums,
      i: null,
      candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
      verifiedCandidates: verifiedList.map(vc => vc.val === key ? { ...vc, freq: 0 } : vc),
      cancellationActive: false,
      phase: 'verification',
      activeVerifyKey: key,
      activeVerifyIdx: null,
      result: [...result],
      variables: { candidate: key, frequency: 0, phase: 'Verification', threshold },
      explanation: `Verify candidate key = ${key}. Scan array to calculate its true frequency.`,
      pseudoStep: `FOR candidate = ${key}:`
    });
    addLines(19, 16, 18, 19);

    let frequency = 0;
    for (let idx = 0; idx < nums.length; idx++) {
      const isMatch = nums[idx] === key;
      if (isMatch) {
        frequency++;
      }

      verifiedList[cIdx].freq = frequency;

      steps.push({
        nums,
        i: null,
        candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
        verifiedCandidates: verifiedList.map(vc => vc.val === key ? { ...vc, freq: frequency } : vc),
        cancellationActive: false,
        phase: 'verification',
        activeVerifyKey: key,
        activeVerifyIdx: idx,
        result: [...result],
        variables: { candidate: key, frequency, idx, 'nums[idx]': nums[idx], phase: 'Verification', threshold },
        explanation: `Scan index ${idx}: nums[${idx}] = ${nums[idx]} ${isMatch ? 'matches' : 'does not match'} candidate ${key}. Frequency = ${frequency}.`,
        pseudoStep: `IF nums[idx] == ${key} → ${isMatch ? 'YES ✓' : 'NO ✗'}`
      });
      addLines(22, 19, 21, 23);
    }

    const passes = frequency > threshold;
    verifiedList[cIdx].status = passes ? 'verified' : 'failed';
    if (passes) {
      result.push(key);
    }

    steps.push({
      nums,
      i: null,
      candidates: Array.from(activeCounts.entries()).map(([val, count]) => ({ val, count })),
      verifiedCandidates: [...verifiedList],
      cancellationActive: false,
      phase: 'verification',
      activeVerifyKey: key,
      activeVerifyIdx: null,
      result: [...result],
      variables: { candidate: key, frequency, phase: 'Verification', threshold, passes },
      explanation: `Candidate ${key} actual frequency = ${frequency} (Threshold > ${threshold}) → ${passes ? 'PASSED' : 'FAILED'}.`,
      pseudoStep: `IF frequency (${frequency}) > threshold (${threshold}) → ${passes ? 'YES ✓' : 'NO ✗'}`
    });
    addLines(26, 21, 25, 27);
  }

  // Return step
  steps.push({
    nums,
    i: null,
    candidates: [],
    verifiedCandidates: [...verifiedList],
    cancellationActive: false,
    phase: 'finished',
    activeVerifyKey: null,
    activeVerifyIdx: null,
    result: [...result],
    variables: { result: JSON.stringify(result) },
    explanation: `Verification completed. Return result: [${result.join(', ')}].`,
    pseudoStep: `RETURN result → [${result.join(', ')}]`
  });
  addLines(30, 23, 29, 31);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MajorityElementIIVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 opacity-90">
              Majority Element II (Modified Boyer-Moore)
            </h2>
            
            <Card className="p-6 bg-card/60 backdrop-blur border-border/50 shadow-sm flex flex-col gap-6">
              
              {/* Array Grid */}
              <div>
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Array State</h4>
                <div className="flex flex-wrap gap-2 relative pt-6 pb-4">
                  {currentStep.nums.map((value, idx) => {
                    let borderClass = 'border-border';
                    let bgClass = 'bg-muted/50';
                    let textClass = 'text-foreground';
                    let isSpecial = false;

                    // Selection scan pointer
                    if (currentStep.phase === 'selection' && idx === currentStep.i) {
                      bgClass = 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground';
                      isSpecial = true;
                    }

                    // Verification scan pointer
                    if (currentStep.phase === 'verification' && idx === currentStep.activeVerifyIdx) {
                      bgClass = 'bg-violet-500 border-violet-500 scale-110 shadow-lg text-white';
                      isSpecial = true;
                    }

                    return (
                      <div key={idx} className="relative flex flex-col items-center">
                        {currentStep.phase === 'selection' && currentStep.i === idx && (
                          <span className="absolute -top-7 text-[9px] font-bold text-primary whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20 animate-pulse">
                            i (read)
                          </span>
                        )}
                        {currentStep.phase === 'verification' && currentStep.activeVerifyIdx === idx && (
                          <span className="absolute -top-7 text-[9px] font-bold text-violet-500 whitespace-nowrap bg-background px-1 py-0.2 rounded border shadow-sm z-20">
                            verify
                          </span>
                        )}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${bgClass} ${borderClass} ${isSpecial ? 'z-10' : ''}`}>
                          <span className={`font-semibold text-xs ${textClass}`}>{value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selection Phase Panel */}
              {currentStep.phase === 'selection' && (
                <div className="space-y-4 border-t border-border/50 pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Candidates (Max 2)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {currentStep.candidates.length === 0 ? (
                      <span className="text-sm font-bold text-muted-foreground italic col-span-2 text-center py-4 bg-muted/20 rounded-lg">No Candidates Active</span>
                    ) : (
                      currentStep.candidates.map((c, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg bg-background border transition-all duration-300 ${
                            currentStep.cancellationActive 
                              ? 'border-destructive bg-destructive/5 animate-shake' 
                              : 'border-border'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground font-semibold">Value</span>
                            <span className="text-[10px] text-muted-foreground font-semibold">Strength</span>
                          </div>
                          <div className="flex justify-between items-baseline mt-1.5">
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/10 border border-primary/20 text-xs font-bold">{c.val}</div>
                            <span className={`text-lg font-black ${c.count <= 0 ? 'text-destructive' : 'text-foreground'}`}>
                              {c.count}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Verification Phase Panel */}
              {(currentStep.phase === 'verification' || currentStep.phase === 'finished') && (
                <div className="space-y-4 border-t border-border/50 pt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Candidate Verification</h4>
                  <div className="flex flex-col gap-3">
                    {currentStep.verifiedCandidates.map((vc, idx) => {
                      const isActive = vc.val === currentStep.activeVerifyKey;
                      let statusBadge = '';
                      let statusText = 'Verifying...';

                      if (vc.status === 'verified') {
                        statusBadge = 'bg-emerald-500 text-white';
                        statusText = 'Verified Majority ✓';
                      } else if (vc.status === 'failed') {
                        statusBadge = 'bg-destructive text-white';
                        statusText = 'Rejected (<= n/3) ✗';
                      } else if (isActive) {
                        statusBadge = 'bg-violet-500 text-white';
                      } else {
                        statusBadge = 'bg-muted text-muted-foreground';
                        statusText = 'Pending';
                      }

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                            isActive ? 'border-violet-500/50 bg-violet-500/5 scale-[1.01]' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/10 border border-primary/20 font-bold">{vc.val}</div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">Actual Count: {vc.freq}</span>
                              <span className="text-[10px] text-muted-foreground">Threshold: &gt; {Math.floor(currentStep.nums.length / 3)}</span>
                            </div>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${statusBadge}`}>
                            {statusText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Verified Result Output */}
              {currentStep.result.length > 0 && (
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Final Output:</span>
                  <div className="flex gap-2">
                    {currentStep.result.map((val, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </Card>
          </div>

          <div className="mt-auto space-y-4">
            <Card className="p-5 border-l-4 border-primary bg-primary/5 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary/80 mb-2">
                Commentary
              </h4>
              <p className="text-[14px] font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap animate-fade-in">
                {currentStep.explanation}
              </p>
            </Card>
          </div>
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
          <VariablePanel variables={currentStep.variables} />
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
