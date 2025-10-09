import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  text: string;
  pattern: string;
  textIndex: number;
  patternHash: number;
  windowHash: number;
  matched: boolean;
  message: string;
  lineNumber: number;
}

export const RabinKarpVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function rabinKarp(text: string, pattern: string): number {
  const d = 256; // Number of characters
  const q = 101; // Prime number
  const m = pattern.length;
  const n = text.length;
  let patternHash = 0, windowHash = 0, h = 1;
  
  // Calculate h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  // Calculate initial hash values
  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
    windowHash = (d * windowHash + text.charCodeAt(i)) % q;
  }
  
  // Slide the pattern
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === windowHash) {
      // Check character by character
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    
    // Calculate hash for next window
    if (i < n - m) {
      windowHash = (d * (windowHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (windowHash < 0) windowHash += q;
    }
  }
  return -1;
}`;

  const generateSteps = () => {
    const text = 'ABCABCABC';
    const pattern = 'ABC';
    const newSteps: Step[] = [];
    const d = 256;
    const q = 101;
    const m = pattern.length;
    const n = text.length;
    let patternHash = 0, windowHash = 0, h = 1;

    // Calculate h
    for (let i = 0; i < m - 1; i++) {
      h = (h * d) % q;
    }

    // Calculate initial hashes
    for (let i = 0; i < m; i++) {
      patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
      windowHash = (d * windowHash + text.charCodeAt(i)) % q;
    }

    newSteps.push({
      text,
      pattern,
      textIndex: 0,
      patternHash,
      windowHash,
      matched: false,
      message: `Pattern hash: ${patternHash}, Initial window hash: ${windowHash}`,
      lineNumber: 13
    });

    // Slide pattern
    for (let i = 0; i <= n - m; i++) {
      newSteps.push({
        text,
        pattern,
        textIndex: i,
        patternHash,
        windowHash,
        matched: false,
        message: `Checking window at index ${i}, hash: ${windowHash}`,
        lineNumber: 19
      });

      if (patternHash === windowHash) {
        let match = true;
        for (let j = 0; j < m; j++) {
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }
        
        if (match) {
          newSteps.push({
            text,
            pattern,
            textIndex: i,
            patternHash,
            windowHash,
            matched: true,
            message: `Hash match! Pattern found at index ${i}`,
            lineNumber: 29
          });
          break;
        } else {
          newSteps.push({
            text,
            pattern,
            textIndex: i,
            patternHash,
            windowHash,
            matched: false,
            message: `Hash collision, characters don't match`,
            lineNumber: 24
          });
        }
      }

      // Calculate next window hash
      if (i < n - m) {
        windowHash = (d * (windowHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
        if (windowHash < 0) windowHash += q;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Text</h3>
        <div className="flex gap-1 mb-6">
          {currentStep.text.split('').map((char, idx) => (
            <div
              key={idx}
              className={`w-10 h-10 flex items-center justify-center rounded border-2 font-mono transition-all ${
                idx >= currentStep.textIndex && idx < currentStep.textIndex + currentStep.pattern.length
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
              className="w-10 h-10 flex items-center justify-center rounded border-2 bg-blue-500/20 border-blue-500 font-mono"
            >
              {char}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Pattern Hash</div>
            <div className="text-xl font-bold">{currentStep.patternHash}</div>
          </div>
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Window Hash</div>
            <div className={`text-xl font-bold ${currentStep.patternHash === currentStep.windowHash ? 'text-green-500' : ''}`}>
              {currentStep.windowHash}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
           <VariablePanel
        variables={{
          'text index': currentStep.textIndex,
          'pattern hash': currentStep.patternHash,
          'window hash': currentStep.windowHash,
          'hash match': String(currentStep.patternHash === currentStep.windowHash)
        }}
      />
      </div>
      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />


      </div>
      </div>
   

  );
};
