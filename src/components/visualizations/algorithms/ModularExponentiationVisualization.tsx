import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Step {
    base: number;
    exponent: number;
    modulus: number;
    result: number;
    currentBase: number;
    currentExponent: number;
    explanation: string;
    highlightedLines: number[];
    variables: Record<string, any>;
}

export const ModularExponentiationVisualization = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const initialBase = 3;
    const initialExponent = 13;
    const initialModulus = 7;

    const steps: Step[] = useMemo(() => {
        const s: Step[] = [];
        let base = initialBase;
        let exponent = initialExponent;
        let modulus = initialModulus;
        let result = 1;

        s.push({
            base: initialBase, exponent: initialExponent, modulus: initialModulus,
            result: 1, currentBase: base, currentExponent: exponent,
            explanation: `Starting modularExponentiation with base=${base}, exponent=${exponent}, modulus=${modulus}.`,
            highlightedLines: [1],
            variables: { base, exponent, modulus }
        });

        if (modulus === 1) {
            s.push({
                base: initialBase, exponent: initialExponent, modulus: initialModulus,
                result: 1, currentBase: base, currentExponent: exponent,
                explanation: `Modulus is 1, return 0.`,
                highlightedLines: [2],
                variables: { modulus }
            });
            return s;
        }

        result = 1;
        s.push({
            base: initialBase, exponent: initialExponent, modulus: initialModulus,
            result, currentBase: base, currentExponent: exponent,
            explanation: `Initializing result = 1.`,
            highlightedLines: [3],
            variables: { result }
        });

        const oldBase = base;
        base = base % modulus;
        s.push({
            base: initialBase, exponent: initialExponent, modulus: initialModulus,
            result, currentBase: base, currentExponent: exponent,
            explanation: `Reducing base modulo modulus: ${oldBase} % ${modulus} = ${base}.`,
            highlightedLines: [4],
            variables: { base, modulus }
        });

        while (exponent > 0) {
            s.push({
                base: initialBase, exponent: initialExponent, modulus: initialModulus,
                result, currentBase: base, currentExponent: exponent,
                explanation: `Checking loop condition: exponent (${exponent}) > 0.`,
                highlightedLines: [5],
                variables: { exponent }
            });

            s.push({
                base: initialBase, exponent: initialExponent, modulus: initialModulus,
                result, currentBase: base, currentExponent: exponent,
                explanation: `Checking if exponent is odd: ${exponent} % 2 === ${exponent % 2}.`,
                highlightedLines: [6],
                variables: { exponent, "exponent % 2": exponent % 2 }
            });

            if (exponent % 2 === 1) {
                const oldResult = result;
                result = (result * base) % modulus;
                s.push({
                    base: initialBase, exponent: initialExponent, modulus: initialModulus,
                    result, currentBase: base, currentExponent: exponent,
                    explanation: `Exponent is odd. Updating result: (${oldResult} * ${base}) % ${modulus} = ${result}.`,
                    highlightedLines: [7],
                    variables: { result, base, modulus }
                });
            }

            const oldExponent = exponent;
            exponent = Math.floor(exponent / 2);
            s.push({
                base: initialBase, exponent: initialExponent, modulus: initialModulus,
                result, currentBase: base, currentExponent: exponent,
                explanation: `Halving exponent: floor(${oldExponent} / 2) = ${exponent}.`,
                highlightedLines: [9],
                variables: { exponent }
            });

            const oldBaseLoop = base;
            base = (base * base) % modulus;
            s.push({
                base: initialBase, exponent: initialExponent, modulus: initialModulus,
                result, currentBase: base, currentExponent: exponent,
                explanation: `Squaring base modulo modulus: (${oldBaseLoop} * ${oldBaseLoop}) % ${modulus} = ${base}.`,
                highlightedLines: [10],
                variables: { base, modulus }
            });
        }

        s.push({
            base: initialBase, exponent: initialExponent, modulus: initialModulus,
            result, currentBase: base, currentExponent: exponent,
            explanation: `Exponent is 0. Loop finished. Returning result = ${result}.`,
            highlightedLines: [5, 12],
            variables: { result }
        });

        return s;
    }, [initialBase, initialExponent, initialModulus]);

    const code = `function modularExponentiation(base: number, exponent: number, modulus: number): number {
  if (modulus === 1) return 0;
  let result: number = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
}`;

    const step = steps[currentStep];

    return (
        <VisualizationLayout
            leftContent={
                <div className="space-y-6">
                    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
                        <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Calculation State</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Result</span>
                                <motion.span
                                    key={step.result}
                                    initial={{ scale: 1.2, color: "var(--primary)" }}
                                    animate={{ scale: 1, color: "var(--foreground)" }}
                                    className="text-3xl font-black"
                                >
                                    {step.result}
                                </motion.span>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Exponent</span>
                                <motion.span
                                    key={step.currentExponent}
                                    initial={{ scale: 1.2, color: "var(--primary)" }}
                                    animate={{ scale: 1, color: "var(--foreground)" }}
                                    className="text-3xl font-black text-blue-500"
                                >
                                    {step.currentExponent}
                                </motion.span>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Base</span>
                                <motion.span
                                    key={step.currentBase}
                                    initial={{ scale: 1.2, color: "var(--primary)" }}
                                    animate={{ scale: 1, color: "var(--foreground)" }}
                                    className="text-3xl font-black text-purple-500"
                                >
                                    {step.currentBase}
                                </motion.span>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-xl border flex flex-col items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Modulus</span>
                                <span className="text-3xl font-black">{step.modulus}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M2 12h20" />
                                </svg>
                            </div>
                            <div className="text-[10px] font-bold text-primary uppercase mb-1">Current Formula</div>
                            <div className="text-lg font-mono font-bold tracking-tight">
                                {step.result} × {step.currentBase}<sup>{step.currentExponent}</sup> mod {step.modulus}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
                        <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
                    </Card>

                    <VariablePanel variables={step.variables} />
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
