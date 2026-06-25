import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  base: number;
  exponent: number;
  modulus: number;
  result: number;
  currentBase: number;
  currentExponent: number;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function modularExponentiation(base: number, exponent: number, modulus: number): number {
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
}`,
  python: `def modular_exponentiation(base: int, exponent: int, modulus: int) -> int:
    result = 1
    base %= modulus
    while exponent > 0:
        if exponent % 2 == 1:
            result = (result * base) % modulus
        base = (base * base) % modulus
        exponent //= 2
    return result`,
  java: `static long modularExponentiation(long base, long exponent, long modulus) {
    long result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 == 1) {
            result = (result * base) % modulus;
        }
        base = (base * base) % modulus;
        exponent = exponent / 2;
    }
    return result;
}`,
  cpp: `class Solution {
public:
    long long modularExponentiation(long long base, long long exponent, long long modulus) {
        long long result = 1;
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 == 1) {
                result = (result * base) % modulus;
            }
            exponent = exponent >> 1;
            base = (base * base) % modulus;
        }
        return result;
    }
};`
};

export const ModularExponentiationVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const initialBase = 3;
  const initialExponent = 13;
  const initialModulus = 7;

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

    let base = initialBase;
    let exponent = initialExponent;
    let modulus = initialModulus;
    let result = 1;

    s.push({
      base: initialBase, exponent: initialExponent, modulus: initialModulus,
      result: 1, currentBase: base, currentExponent: exponent,
      explanation: `Starting modularExponentiation with base=${base}, exponent=${exponent}, modulus=${modulus}.`,
      pseudoStep: `CALL modularExponentiation(base = ${base}, exp = ${exponent}, mod = ${modulus})`,
      variables: { base, exponent, modulus }
    });
    addLines(1, 1, 1, 3);

    if (modulus === 1) {
      s.push({
        base: initialBase, exponent: initialExponent, modulus: initialModulus,
        result: 1, currentBase: base, currentExponent: exponent,
        explanation: `Modulus is 1, return 0.`,
        pseudoStep: `IF modulus == 1 → RETURN 0`,
        variables: { modulus }
      });
      addLines(2, 1, 1, 3);
      return { steps: s, stepLineNumbers: lines };
    }

    result = 1;
    s.push({
      base: initialBase, exponent: initialExponent, modulus: initialModulus,
      result, currentBase: base, currentExponent: exponent,
      explanation: `Initializing result = 1.`,
      pseudoStep: `SET result = 1`,
      variables: { result }
    });
    addLines(3, 2, 2, 4);

    const oldBase = base;
    base = base % modulus;
    s.push({
      base: initialBase, exponent: initialExponent, modulus: initialModulus,
      result, currentBase: base, currentExponent: exponent,
      explanation: `Reducing base modulo modulus: ${oldBase} % ${modulus} = ${base}.`,
      pseudoStep: `SET base = base % modulus (${oldBase} % ${modulus} = ${base})`,
      variables: { base, modulus }
    });
    addLines(4, 3, 3, 5);

    while (exponent > 0) {
      s.push({
        base: initialBase, exponent: initialExponent, modulus: initialModulus,
        result, currentBase: base, currentExponent: exponent,
        explanation: `Checking loop condition: exponent (${exponent}) > 0.`,
        pseudoStep: `WHILE exponent > 0 (${exponent} > 0) → YES ✓`,
        variables: { exponent }
      });
      addLines(5, 4, 4, 6);

      s.push({
        base: initialBase, exponent: initialExponent, modulus: initialModulus,
        result, currentBase: base, currentExponent: exponent,
        explanation: `Checking if exponent is odd: ${exponent} % 2 === ${exponent % 2}.`,
        pseudoStep: `IF exponent % 2 == 1 (${exponent} % 2 == ${exponent % 2}) → ${exponent % 2 === 1 ? 'YES ✓' : 'NO ✗'}`,
        variables: { exponent, "exponent % 2": exponent % 2 }
      });
      addLines(6, 5, 5, 7);

      if (exponent % 2 === 1) {
        const oldResult = result;
        result = (result * base) % modulus;
        s.push({
          base: initialBase, exponent: initialExponent, modulus: initialModulus,
          result, currentBase: base, currentExponent: exponent,
          explanation: `Exponent is odd. Updating result: (${oldResult} * ${base}) % ${modulus} = ${result}.`,
          pseudoStep: `SET result = (result * base) % modulus (result = (${oldResult} * ${base}) % ${modulus} = ${result})`,
          variables: { result, base, modulus }
        });
        addLines(7, 6, 6, 8);
      }

      const oldExponent = exponent;
      exponent = Math.floor(exponent / 2);
      s.push({
        base: initialBase, exponent: initialExponent, modulus: initialModulus,
        result, currentBase: base, currentExponent: exponent,
        explanation: `Halving exponent: floor(${oldExponent} / 2) = ${exponent}.`,
        pseudoStep: `SET exponent = exponent / 2 (${oldExponent} / 2 = ${exponent})`,
        variables: { exponent }
      });
      addLines(9, 8, 9, 10);

      const oldBaseLoop = base;
      base = (base * base) % modulus;
      s.push({
        base: initialBase, exponent: initialExponent, modulus: initialModulus,
        result, currentBase: base, currentExponent: exponent,
        explanation: `Squaring base modulo modulus: (${oldBaseLoop} * ${oldBaseLoop}) % ${modulus} = ${base}.`,
        pseudoStep: `SET base = (base * base) % modulus (base = (${oldBaseLoop}^2) % ${modulus} = ${base})`,
        variables: { base, modulus }
      });
      addLines(10, 7, 8, 11);
    }

    s.push({
      base: initialBase, exponent: initialExponent, modulus: initialModulus,
      result, currentBase: base, currentExponent: exponent,
      explanation: `Exponent is 0. Loop finished. Returning result = ${result}.`,
      pseudoStep: `WHILE exponent > 0 (0 > 0) → NO ✗`,
      variables: { result }
    });
    addLines(5, 4, 4, 6);

    s.push({
      base: initialBase, exponent: initialExponent, modulus: initialModulus,
      result, currentBase: base, currentExponent: exponent,
      explanation: `Return final result = ${result}.`,
      pseudoStep: `RETURN result (result = ${result})`,
      variables: { result }
    });
    addLines(12, 9, 11, 13);

    return { steps: s, stepLineNumbers: lines };
  }, [initialBase, initialExponent, initialModulus]);

  const step = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="flex flex-col h-full justify-between gap-6">
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
                <div className="text-[10px] font-bold text-primary uppercase mb-1">Current Formula State</div>
                <div className="text-lg font-mono font-bold tracking-tight">
                  {step.result} × {step.currentBase}<sup>{step.currentExponent}</sup> mod {step.modulus}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4 mt-auto">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
              <p className="text-sm text-foreground leading-relaxed font-medium min-h-[40px]">{step.explanation}</p>
            </Card>

            <VariablePanel variables={step.variables} />
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
