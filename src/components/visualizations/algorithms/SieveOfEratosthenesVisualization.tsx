import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface Step {
    isPrime: boolean[];
    primes: number[];
    i: number | null;
    j: number | null;
    explanation: string;
    highlightedLines: number[];
    variables: Record<string, any>;
}

export const SieveOfEratosthenesVisualization = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const n = 30; // Using 30 for clear visualization

    const steps: Step[] = useMemo(() => {
        const s: Step[] = [];
        const isPrime = new Array(n + 1).fill(true);
        const primesFound: number[] = [];

        s.push({
            isPrime: [...isPrime],
            primes: [],
            i: null,
            j: null,
            explanation: `Initializing isPrime array of size ${n + 1} with all values as true.`,
            highlightedLines: [2],
            variables: { n }
        });

        isPrime[0] = isPrime[1] = false;
        s.push({
            isPrime: [...isPrime],
            primes: [],
            i: null,
            j: null,
            explanation: "Setting isPrime[0] and isPrime[1] to false since 0 and 1 are not prime numbers.",
            highlightedLines: [3],
            variables: { "isPrime[0]": false, "isPrime[1]": false }
        });

        for (let i = 2; i * i <= n; i++) {
            s.push({
                isPrime: [...isPrime],
                primes: [],
                i,
                j: null,
                explanation: `Checking if i = ${i} is prime. Loop condition i*i <= n (${i * i} <= ${n}) is true.`,
                highlightedLines: [4],
                variables: { i, "i*i": i * i, n }
            });

            s.push({
                isPrime: [...isPrime],
                primes: [],
                i,
                j: null,
                explanation: `Is isPrime[${i}] true? ${isPrime[i] ? "Yes, it is prime." : "No, it's already marked composite."}`,
                highlightedLines: [5],
                variables: { i, "isPrime[i]": isPrime[i] }
            });

            if (isPrime[i]) {
                for (let j = i * i; j <= n; j += i) {
                    s.push({
                        isPrime: [...isPrime],
                        primes: [],
                        i,
                        j,
                        explanation: `Starting inner loop to mark multiples of ${i}. Initializing j = i * i = ${j}.`,
                        highlightedLines: [6],
                        variables: { i, j }
                    });

                    isPrime[j] = false;
                    s.push({
                        isPrime: [...isPrime],
                        primes: [],
                        i,
                        j,
                        explanation: `Marking j = ${j} as false (composite).`,
                        highlightedLines: [7],
                        variables: { i, j, "isPrime[j]": false }
                    });
                }
            }
        }

        // After the loop, the code continues to collect primes
        s.push({
            isPrime: [...isPrime],
            primes: [],
            i: null,
            j: null,
            explanation: "Calculations complete. Initializing empty primes array to collect results.",
            highlightedLines: [11],
            variables: {}
        });

        for (let i = 2; i <= n; i++) {
            s.push({
                isPrime: [...isPrime],
                primes: [...primesFound],
                i,
                j: null,
                explanation: `Checking isPrime[${i}] to see if it should be added to the result.`,
                highlightedLines: [12, 13],
                variables: { i, "isPrime[i]": isPrime[i] }
            });

            if (isPrime[i]) {
                primesFound.push(i);
                s.push({
                    isPrime: [...isPrime],
                    primes: [...primesFound],
                    i,
                    j: null,
                    explanation: `isPrime[${i}] is true, adding ${i} to primes array.`,
                    highlightedLines: [13],
                    variables: { i, primes: `[${primesFound.join(', ')}]` }
                });
            }
        }

        s.push({
            isPrime: [...isPrime],
            primes: [...primesFound],
            i: null,
            j: null,
            explanation: `Returning the final array of prime numbers: [${primesFound.join(', ')}].`,
            highlightedLines: [15],
            variables: { totalPrimes: primesFound.length }
        });

        return s;
    }, [n]);

    const code = `function sieveOfEratosthenes(n: number): number[] {
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
}`;

    const step = steps[currentStep];

    return (
        <VisualizationLayout
            leftContent={
                <div className="space-y-6">
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Number Sieve (0 to {n})</h3>
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            <AnimatePresence mode="popLayout">
                                {step.isPrime.map((isPrime, idx) => {
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
                                    } else if (!isPrime && idx > 1) {
                                        bgColor = "rgba(239, 68, 68, 0.1)"; // light red
                                        borderColor = "rgba(239, 68, 68, 0.3)";
                                    } else if (isPrime && idx > 1 && step.i === null && currentStep > 2) {
                                        // After main sieve loop, show remaining primes
                                        bgColor = "rgba(34, 197, 94, 0.1)";
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: 1,
                                                scale: isI || isJ ? 1.1 : 1,
                                                backgroundColor: bgColor,
                                                borderColor: borderColor
                                            }}
                                            className={`w-8 h-8 xxs:w-9 xxs:h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-lg flex flex-col items-center justify-center border-2 transition-all relative ${isI || isJ ? "shadow-lg z-10 scale-110" : ""}`}
                                        >
                                            <span className={`text-[10px] xs:text-xs sm:text-sm font-bold ${!isPrime && idx > 1 ? "text-muted-foreground line-through" : ""}`}>{idx}</span>
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

                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Execution Flow</h4>
                        <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
                    </Card>

                    <VariablePanel variables={step.variables} />

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
            }
            rightContent={
                <AnimatedCodeEditor
                    code={code}
                    language="typescript"
                    highlightedLines={step.highlightedLines}
                />
            }
            controls={
                <SimpleStepControls
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onStepChange={setCurrentStep}
                />
            }
        />
    );
};
