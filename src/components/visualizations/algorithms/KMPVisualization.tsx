import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  text: string;
  pattern: string;
  lps: number[];
  textIndex: number;
  patternIndex: number;
  matched: boolean;
  message: string;
  lineNumber: number;
}

export const KMPVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function KMP(text: string, pattern: string): number {
  const lps = computeLPS(pattern);
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) return i - j;
    } else {
      if (j > 0) j = lps[j - 1];
      else i++;
    }
  }
  return -1;
}

function computeLPS(pattern: string): number[] {
  const lps = new Array(pattern.length).fill(0);
  let len = 0, i = 1;
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else {
      if (len > 0) len = lps[len - 1];
      else lps[i++] = 0;
    }
  }
  return lps;
}`;

  const generateSteps = () => {
    const text = 'ABABCABAB';
    const pattern = 'ABAB';
    const newSteps: Step[] = [];

    // Compute LPS
    const lps = new Array(pattern.length).fill(0);
    let len = 0, idx = 1;
    
    newSteps.push({
      text,
      pattern,
      lps: [...lps],
      textIndex: -1,
      patternIndex: -1,
      matched: false,
      message: 'Computing LPS (Longest Prefix Suffix) array',
      lineNumber: 17
    });

    while (idx < pattern.length) {
      if (pattern[idx] === pattern[len]) {
        lps[idx] = ++len;
        newSteps.push({
          text,
          pattern,
          lps: [...lps],
          textIndex: -1,
          patternIndex: idx,
          matched: false,
          message: `LPS[${idx}] = ${lps[idx]}`,
          lineNumber: 21
        });
        idx++;
      } else {
        if (len > 0) len = lps[len - 1];
        else {
          lps[idx] = 0;
          idx++;
        }
      }
    }

    // KMP Search
    let i = 0, j = 0;
    
    newSteps.push({
      text,
      pattern,
      lps: [...lps],
      textIndex: 0,
      patternIndex: 0,
      matched: false,
      message: 'Starting KMP pattern matching',
      lineNumber: 2
    });

    while (i < text.length) {
      newSteps.push({
        text,
        pattern,
        lps: [...lps],
        textIndex: i,
        patternIndex: j,
        matched: false,
        message: `Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`,
        lineNumber: 5
      });

      if (text[i] === pattern[j]) {
        i++;
        j++;
        if (j === pattern.length) {
          newSteps.push({
            text,
            pattern,
            lps: [...lps],
            textIndex: i - j,
            patternIndex: j,
            matched: true,
            message: `Pattern found at index ${i - j}`,
            lineNumber: 8
          });
          break;
        }
      } else {
        if (j > 0) {
          j = lps[j - 1];
          newSteps.push({
            text,
            pattern,
            lps: [...lps],
            textIndex: i,
            patternIndex: j,
            matched: false,
            message: `Mismatch: using LPS, set j = ${j}`,
            lineNumber: 10
          });
        } else {
          i++;
        }
      }
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Text</h3>
        <div className="flex gap-1 mb-6">
          {currentStep.text.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono transition-all ${
                idx === currentStep.textIndex
                  ? currentStep.matched ? 'bg-green-500/20 border-green-500' : 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Pattern</h3>
        <div className="flex gap-1 mb-6">
          {currentStep.pattern.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono transition-all ${
                idx === currentStep.patternIndex
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-card border-border'
              }`}
            >
              {char}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">LPS Array</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.lps.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">[{idx}]</div>
              <div className="w-10 h-10 flex items-center justify-center rounded border-2 bg-muted/50 border-border font-mono">
                {val}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'text index': currentStep.textIndex >= 0 ? currentStep.textIndex : 'none',
          'pattern index': currentStep.patternIndex >= 0 ? currentStep.patternIndex : 'none',
          'matched': String(currentStep.matched)
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
