import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface Step { words: string[]; currentIdx: number; groups: Record<string, string[]>; message: string; highlightedLines: number[]; }

export const GroupAnagramsVisualization = () => {
  const code = `function groupAnagrams(strs: string[]): string[][] {
  const map: Record<string, string[]> = {};
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    if (!map[sorted]) map[sorted] = [];
    map[sorted].push(str);
  }
  return Object.values(map);
}`;

  const steps: Step[] = [
    { words: ["eat","tea","tan","ate"], currentIdx: -1, groups: {}, message: "Group anagrams by sorted key", highlightedLines: [2] },
    { words: ["eat","tea","tan","ate"], currentIdx: 0, groups: { aet: ["eat"] }, message: "'eat' → 'aet'", highlightedLines: [4, 6] },
    { words: ["eat","tea","tan","ate"], currentIdx: 1, groups: { aet: ["eat","tea"] }, message: "'tea' → 'aet' (same group!)", highlightedLines: [6] },
    { words: ["eat","tea","tan","ate"], currentIdx: 3, groups: { aet: ["eat","tea","ate"], ant: ["tan"] }, message: "Result: [['eat','tea','ate'], ['tan']]", highlightedLines: [8] }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentStepIndex(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6"><div className="flex gap-2 mb-4">{currentStep.words.map((w, i) => <div key={i} className={`px-3 py-2 rounded font-mono ${i === currentStep.currentIdx ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>"{w}"</div>)}</div><div className="space-y-2">{Object.entries(currentStep.groups).map(([k, ws]) => <Card key={k} className="p-3"><span className="text-xs text-muted-foreground">Key: "{k}"</span><div className="flex gap-2 mt-1">{ws.map((w, i) => <span key={i} className="px-2 py-1 bg-accent rounded font-mono text-sm">"{w}"</span>)}</div></Card>)}</div><Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{currentStep.message}</p></Card></Card>
        <Card className="p-4 overflow-hidden"><div className="h-[600px]"><Editor height="100%" defaultLanguage="typescript" value={code} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(editor, monaco) => { editor.createDecorationsCollection(currentStep.highlightedLines.map(line => ({ range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, className: 'highlighted-line' } }))); }} /></div></Card>
      </div>
      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};
