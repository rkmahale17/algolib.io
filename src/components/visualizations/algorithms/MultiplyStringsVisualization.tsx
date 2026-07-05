import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  resArray: number[];
  n1Array: string[];
  n2Array: string[];
  resHighlights: number[];
  n1Highlights: number[];
  n2Highlights: number[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function multiply(num1: string, num2: string): string {
  if (num1 === "0" || num2 === "0") return "0";
  const res = new Array(num1.length + num2.length).fill(0);
  const n1 = num1.split("").reverse();
  const n2 = num2.split("").reverse();
  for (let i = 0; i < n1.length; i++) {
    for (let j = 0; j < n2.length; j++) {
      const digitProduct = Number(n1[i]) * Number(n2[j]);
      res[i + j] += digitProduct;
      res[i + j + 1] += Math.floor(res[i + j] / 10);
      res[i + j] %= 10;
    }
  }
  res.reverse();
  let start = 0;
  while (start < res.length && res[start] === 0) {
    start++;
  }
  return res.slice(start).join("");
}`,
  python: `def multiply(num1: str, num2: str) -> str:
    if num1 == "0" or num2 == "0":
        return "0"
    res = [0] * (len(num1) + len(num2))
    num1_rev = num1[::-1]
    num2_rev = num2[::-1]
    for i in range(len(num1_rev)):
        for j in range(len(num2_rev)):
            digit_product = int(num1_rev[i]) * int(num2_rev[j])
            res[i + j] += digit_product
            res[i + j + 1] += res[i + j] // 10
            res[i + j] %= 10
    res.reverse()
    start_index = 0
    while start_index < len(res) - 1 and res[start_index] == 0:
        start_index += 1
    return "".join(map(str, res[start_index:]))`,
  java: `public static class Solution {
    public String multiply(String num1, String num2) {
        if (num1.equals("0") || num2.equals("0")) {
            return "0";
        }
        int[] res = new int[num1.length() + num2.length()];
        for (int i = num1.length() - 1; i >= 0; i--) {
            int digit1 = num1.charAt(i) - '0';
            for (int j = num2.length() - 1; j >= 0; j--) {
                int digit2 = num2.charAt(j) - '0';
                int product = digit1 * digit2;
                int sum = res[i + j + 1] + product;
                res[i + j] += sum / 10;
                res[i + j + 1] = sum % 10;
            }
        }
        StringBuilder sb = new StringBuilder();
        boolean leadingZeros = true;
        for (int digit : res) {
            if (leadingZeros && digit == 0) {
                continue;
            }
            leadingZeros = false;
            sb.append(digit);
        }
        if (sb.length() == 0) {
            return "0"; 
        }
        return sb.toString();
    }
}`,
  cpp: `class Solution {
public:
    string multiply(string num1, string num2) {
        if (num1 == "0" || num2 == "0") {
            return "0";
        }
        vector<int> res(num1.length() + num2.length(), 0);
        for (int i = num1.length() - 1; i >= 0; i--) {
            int digit1 = num1[i] - '0';
            for (int j = num2.length() - 1; j >= 0; j--) {
                int digit2 = num2[j] - '0';
                int product = digit1 * digit2;
                int p1 = num1.length() - 1 - i;
                int p2 = num2.length() - 1 - j;
                res[p1 + p2] += product;
                res[p1 + p2 + 1] += res[p1 + p2] / 10;
                res[p1 + p2] %= 10;
            }
        }
        reverse(res.begin(), res.end());
        int start = 0;
        while (start < res.size() - 1 && res[start] == 0) {
            start++;
        }
        string result_str = "";
        for (int k = start; k < res.size(); k++) {
            result_str += to_string(res[k]);
        }
        return result_str;
    }
};`
};

export const MultiplyStringsVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const num1 = "123";
  const num2 = "45";

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const res = new Array(num1.length + num2.length).fill(0);
    const n1 = num1.split("").reverse();
    const n2 = num2.split("").reverse();

    const addStep = (
      hRes: number[],
      hN1: number[],
      hN2: number[],
      explanation: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, jv: number, cp: number
    ) => {
      stepsList.push({
        resArray: [...res],
        n1Array: [...n1],
        n2Array: [...n2],
        resHighlights: hRes,
        n1Highlights: hN1,
        n2Highlights: hN2,
        explanation,
        pseudoStep: pseudo,
        variables: vars
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      [], [], [],
      `First, let's see if any of our numbers are 0. If we multiply anything by 0, the answer is just 0! Here, we have "${num1}" and "${num2}".`,
      `multiply(num1="${num1}", num2="${num2}")`,
      { num1, num2 },
      2, 2, 3, 4
    );

    addStep(
      [], [], [],
      `We make a list called 'res' (result) to hold our answer digits. It has ${res.length} empty spots (0s) because ${num1} has 3 digits and ${num2} has 2 digits (3 + 2 = 5).`,
      "SET res = [0] * (len(num1) + len(num2))",
      { num1, num2, "res.length": res.length },
      3, 4, 6, 7
    );

    addStep(
      [], [], [],
      `To multiply digit-by-digit, we flip both numbers backwards so we can start from the ones place (the rightmost digit).`,
      "SET n1 = reverse(num1), n2 = reverse(num2)",
      { n1: `[${n1.join(',')}]`, n2: `[${n2.join(',')}]` },
      4, 5, 6, 7
    );

    for (let i = 0; i < n1.length; i++) {
      addStep(
        [], [i], [],
        `We pick the digit '${n1[i]}' from our first flipped number (n1) at index ${i}.`,
        `FOR i FROM 0 TO ${n1.length - 1}  →  i = ${i}`,
        { i, 'n1[i]': n1[i] },
        6, 7, 7, 8
      );

      for (let j = 0; j < n2.length; j++) {
        addStep(
          [], [i], [j],
          `Now we look at the digit '${n2[j]}' from our second flipped number (n2) at index ${j}.`,
          `FOR j FROM 0 TO ${n2.length - 1}  →  j = ${j}`,
          { i, j, 'n1[i]': n1[i], 'n2[j]': n2[j] },
          7, 8, 9, 10
        );

        const digitProduct = Number(n1[i]) * Number(n2[j]);
        addStep(
          [], [i], [j],
          `We multiply '${n1[i]}' and '${n2[j]}' together. ${n1[i]} * ${n2[j]} = ${digitProduct}.`,
          `SET digitProduct = n1[i] * n2[j]  →  ${digitProduct}`,
          { i, j, digitProduct, 'n1[i]': n1[i], 'n2[j]': n2[j] },
          8, 9, 11, 12
        );

        res[i + j] += digitProduct;
        addStep(
          [i + j], [i], [j],
          `We add this product (${digitProduct}) to the spot at index ${i + j} in our 'res' list.`,
          `SET res[i+j] += digitProduct  →  res[${i+j}] = ${res[i + j]}`,
          { i, j, digitProduct, 'res[i+j]': res[i + j] },
          9, 10, 12, 15
        );

        const carry = Math.floor(res[i + j] / 10);
        res[i + j + 1] += carry;
        addStep(
          [i + j + 1], [i], [j],
          `If the spot got too big (10 or more), we carry over the tens part (${carry}) to the next spot (index ${i + j + 1}).`,
          `SET res[i+j+1] += res[i+j] // 10  →  res[${i + j + 1}] = ${res[i + j + 1]}`,
          { i, j, carry, 'res[i+j+1]': res[i + j + 1] },
          10, 11, 13, 16
        );

        res[i + j] %= 10;
        addStep(
          [i + j], [i], [j],
          `And we keep only the ones part (the last digit) in the current spot (index ${i + j}). So it becomes ${res[i + j]}.`,
          `SET res[i+j] %= 10  →  ${res[i + j]}`,
          { i, j, 'res[i+j]': res[i + j] },
          11, 12, 14, 17
        );
      }
    }

    res.reverse();
    addStep(
      [], [], [],
      `We have multiplied all the digits! We flip our answer list back to normal. Now the biggest place values are on the left.`,
      "res.reverse()",
      { res: `[${res.join(',')}]` },
      14, 13, 17, 20
    );

    let start = 0;
    addStep(
      [start], [], [],
      `Let's find the true start of our number. Sometimes we have extra zeros at the very beginning (like 0123). We want to skip them!`,
      "SET start = 0",
      { start },
      15, 14, 18, 21
    );

    while (start < res.length && res[start] === 0) {
      addStep(
        [start], [], [],
        `The spot at index ${start} has a 0, so we will skip it.`,
        `WHILE start < len(res) AND res[start] == 0  →  res[${start}] == 0`,
        { start, 'res[start]': res[start] },
        16, 15, 20, 22
      );
      start++;
      addStep(
        [start], [], [],
        `Moving our start point one step to the right.`,
        `SET start += 1  →  ${start}`,
        { start },
        17, 16, 20, 23
      );
    }
    
    addStep(
      res.map((_, idx) => idx).filter(idx => idx >= start), [], [],
      `Yay! We got our final answer! We just glue the remaining digits together. The answer is "${res.slice(start).join("")}".`,
      `RETURN join(res[start:])  →  "${res.slice(start).join("")}"`,
      { finalResult: res.slice(start).join("") },
      19, 17, 29, 28
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [num1, num2]);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div className="flex flex-col gap-6 bg-muted/30 rounded-lg border border-border/50 p-6">
            {step.n1Array.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">First Flipped Number (n1)</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {step.n1Array.map((value, idx) => (
                    <div key={`n1-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                          step.n1Highlights.includes(idx)
                            ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground font-bold'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.n2Array.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Second Flipped Number (n2)</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {step.n2Array.map((value, idx) => (
                    <div key={`n2-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                          step.n2Highlights.includes(idx)
                            ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground font-bold'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        <span className="text-base sm:text-lg">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground text-center uppercase tracking-wider">Result List (res)</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {step.resArray.length > 0 ? step.resArray.map((value, idx) => (
                  <div key={`res-${idx}`} className="flex flex-col items-center gap-1 sm:gap-2">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                        step.resHighlights.includes(idx)
                          ? 'bg-primary border-primary scale-110 shadow-lg text-primary-foreground font-bold'
                          : 'bg-muted/50 border-border text-foreground'
                      }`}
                    >
                      <span className="text-base sm:text-lg">{value}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground italic">Waiting to create the list...</div>
                )}
              </div>
            </div>
          </div>

          <Card className="p-4 bg-primary/5 border border-primary/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">{step.explanation}</p>
          </Card>
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
export default MultiplyStringsVisualization;
