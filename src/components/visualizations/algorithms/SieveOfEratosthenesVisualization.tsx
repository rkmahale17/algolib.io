import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  isPrime: boolean[];
  primes: number[];
  i: number | null;
  j: number | null;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function sieveOfEratosthenes(n: number): number[] {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}`,
  python: `def sieve_of_eratosthenes(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    primes = [i for i in range(2, n + 1) if is_prime[i]]
    return primes`,
  java: `public static class Solution {
    public static List<Integer> sieveOfEratosthenes(int n) {
        boolean[] isPrime = new boolean[n + 1];
        Arrays.fill(isPrime, true);
        isPrime[0] = isPrime[1] = false;
        for (int i = 2; i * i <= n; i++) {
            if (isPrime[i]) {
                for (int j = i * i; j <= n; j += i) {
                    isPrime[j] = false;
                }
            }
        }
        List<Integer> primes = new ArrayList<>();
        for (int i = 2; i <= n; i++) {
            if (isPrime[i]) {
                primes.add(i);
            }
        }
        return primes;
    }
}`,
  cpp: `class Solution {
public:
  vector < int > sieveOfEratosthenes(int n) {
    vector < bool > isPrime(n + 1, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        for (int j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }
    vector < int > primes;
    for (int i = 2; i <= n; i++) {
      if (isPrime[i]) primes.push_back(i);
    }
    return primes;
  }
};`
};

export const SieveOfEratosthenesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const n = 30; // Using 30 for clear visualization

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    const isPrime = new Array(n + 1).fill(true);
    const primesFound: number[] = [];

    s.push({
      isPrime: [...isPrime],
      primes: [],
      i: null,
      j: null,
      explanation: `Initializing isPrime array of size ${n + 1} with all values as true.`,
      pseudoStep: `SET isPrime = [true, ..., true] (size = ${n + 1})`,
      variables: { n }
    });
    addLines(2, 2, 3, 4);

    isPrime[0] = isPrime[1] = false;
    s.push({
      isPrime: [...isPrime],
      primes: [],
      i: null,
      j: null,
      explanation: "Setting isPrime[0] and isPrime[1] to false since 0 and 1 are not prime numbers.",
      pseudoStep: "SET isPrime[0] = isPrime[1] = false",
      variables: { "isPrime[0]": false, "isPrime[1]": false }
    });
    addLines(3, 3, 5, 5);

    for (let i = 2; i * i <= n; i++) {
      s.push({
        isPrime: [...isPrime],
        primes: [],
        i,
        j: null,
        explanation: `Checking if i = ${i} is prime. Loop condition i*i <= n (${i * i} <= ${n}) is true.`,
        pseudoStep: `FOR i = 2 TO sqrt(n) (i = ${i})`,
        variables: { i, "i*i": i * i, n }
      });
      addLines(4, 4, 6, 6);

      s.push({
        isPrime: [...isPrime],
        primes: [],
        i,
        j: null,
        explanation: `Checking if isPrime[${i}] is true: ${isPrime[i] ? "Yes, it is prime." : "No, it's composite."}`,
        pseudoStep: `IF isPrime[${i}] → ${isPrime[i] ? "YES ✓" : "NO ✗"}`,
        variables: { i, "isPrime[i]": isPrime[i] }
      });
      addLines(5, 5, 7, 7);

      if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
          s.push({
            isPrime: [...isPrime],
            primes: [],
            i,
            j,
            explanation: `Starting inner loop to mark multiples of ${i}. Initializing j = i * i = ${j}.`,
            pseudoStep: `FOR j = i*i TO n (j = ${j})`,
            variables: { i, j }
          });
          addLines(6, 6, 8, 8);

          isPrime[j] = false;
          s.push({
            isPrime: [...isPrime],
            primes: [],
            i,
            j,
            explanation: `Marking j = ${j} as false (composite).`,
            pseudoStep: `SET isPrime[${j}] = false`,
            variables: { i, j, "isPrime[j]": false }
          });
          addLines(7, 7, 9, 9);
        }
      }
    }

    s.push({
      isPrime: [...isPrime],
      primes: [],
      i: null,
      j: null,
      explanation: "Calculations complete. Initializing empty primes array to collect results.",
      pseudoStep: "SET primes = []",
      variables: {}
    });
    addLines(11, 8, 13, 13);

    for (let i = 2; i <= n; i++) {
      s.push({
        isPrime: [...isPrime],
        primes: [...primesFound],
        i,
        j: null,
        explanation: `Checking isPrime[${i}] to see if it should be added to the result.`,
        pseudoStep: `FOR i = 2 TO n (i = ${i})`,
        variables: { i, "isPrime[i]": isPrime[i] }
      });
      addLines(12, 8, 14, 14);

      if (isPrime[i]) {
        primesFound.push(i);
        s.push({
          isPrime: [...isPrime],
          primes: [...primesFound],
          i,
          j: null,
          explanation: `isPrime[${i}] is true, adding ${i} to primes array.`,
          pseudoStep: `CALL primes.push(${i})`,
          variables: { i, primes: `[${primesFound.join(', ')}]` }
        });
        addLines(13, 8, 15, 15);
      }
    }

    s.push({
      isPrime: [...isPrime],
      primes: [...primesFound],
      i: null,
      j: null,
      explanation: `Returning the final array of prime numbers: [${primesFound.join(', ')}].`,
      pseudoStep: `RETURN primes`,
      variables: { totalPrimes: primesFound.length }
    });
    addLines(15, 9, 19, 17);

    return { steps: s, stepLineNumbers: lines };
  }, [n]);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Number Sieve (0 to {n})</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <AnimatePresence mode="popLayout">
                  {step.isPrime.map((isPrimeVal, idx) => {
                    const isI = idx === step.i;
                    const isJ = idx === step.j;
                    const isResult = step.primes.includes(idx);

                    let bgColor = "var(--card)";
                    let borderColor = "var(--border)";

                    if (isI) {
                      bgColor = "rgba(147, 51, 234, 0.2)"; // purple
                      borderColor = "rgb(147, 51, 234)";
                    } else if (isJ) {
                      bgColor = "rgba(239, 68, 68, 0.2)"; // red
                      borderColor = "rgb(239, 68, 68)";
                    } else if (isResult) {
                      bgColor = "rgba(34, 197, 94, 0.3)"; // green
                      borderColor = "rgb(34, 197, 94)";
                    } else if (!isPrimeVal && idx > 1) {
                      bgColor = "rgba(239, 68, 68, 0.1)"; // light red
                      borderColor = "rgba(239, 68, 68, 0.3)";
                    } else if (isPrimeVal && idx > 1 && step.i === null && currentStepIndex > 2) {
                      // After main sieve loop, show remaining primes
                      bgColor = "rgba(34, 197, 94, 0.1)";
                    }

                    return (
                      <motion.div
                        key={idx}
                        layout
                        className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center border-2 transition-all relative ${isI || isJ ? "shadow-lg z-10 scale-110" : ""}`}
                        style={{
                          backgroundColor: bgColor,
                          borderColor: borderColor
                        }}
                      >
                        <span className={`text-xs font-semibold ${!isPrimeVal && idx > 1 ? "text-muted-foreground line-through" : ""}`}>{idx}</span>
                        <div className="absolute -bottom-2.5 flex flex-col items-center">
                          {isI && <span className="text-[8px] font-black text-white uppercase bg-purple-600 px-1 rounded">i</span>}
                          {isJ && <span className="text-[8px] font-black text-white uppercase bg-red-600 px-1 rounded">mark</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-[10px] uppercase font-bold tracking-tight">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500"></div>
                  <span className="text-muted-foreground">Current i</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500"></div>
                  <span className="text-muted-foreground">Marking j</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500"></div>
                  <span className="text-muted-foreground">Prime Result</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-500/10 border border-red-500/30"></div>
                  <span className="text-muted-foreground">Composite</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            {step.primes.length > 0 && (
              <Card className="p-4 bg-green-500/5 border-green-500/20">
                <h4 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Primes Array</h4>
                <div className="flex flex-wrap gap-2">
                  {step.primes.map(p => (
                    <span key={p} className="px-2 py-1 bg-green-500/20 text-green-700 rounded text-xs font-bold">{p}</span>
                  ))}
                </div>
              </Card>
            )}
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
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Execution Flow</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
          </Card>
          <VariablePanel variables={step.variables} />
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
