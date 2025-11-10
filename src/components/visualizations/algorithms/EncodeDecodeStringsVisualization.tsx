import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import type { editor as MonacoEditor } from 'monaco-editor';

export const EncodeDecodeStringsVisualization = () => {
  const steps = [
    { strs: ["hello", "world"], encoded: "", decoded: [], phase: "encode", idx: -1, message: "ENCODE: Start", highlightedLines: [2] },
    { strs: ["hello", "world"], encoded: "5#hello", decoded: [], phase: "encode", idx: 0, message: "Add '5#hello'", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: [], phase: "encode", idx: 1, message: "Add '5#world'. Encoded complete!", highlightedLines: [4] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello"], phase: "decode", idx: 0, message: "DECODE: Extract 'hello'", highlightedLines: [17] },
    { strs: ["hello", "world"], encoded: "5#hello5#world", decoded: ["hello", "world"], phase: "decode", idx: 1, message: "Extract 'world'. Complete!", highlightedLines: [23] }
  ];

  const [idx, setIdx] = useState(0);
  const step = steps[idx];
  const ref = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monaco = useRef<typeof import('monaco-editor') | null>(null);

  useEffect(() => {
    if (ref.current && monaco.current) {
      ref.current.createDecorationsCollection(step.highlightedLines.map(l => ({ range: new monaco.current!.Range(l, 1, l, 1), options: { isWholeLine: true, className: 'highlighted-line' } })));
    }
  }, [idx]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setIdx(0)} variant="outline" size="sm"><RotateCcw className="h-4 w-4" /></Button>
          <Button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} variant="outline" size="sm"><SkipBack className="h-4 w-4" /></Button>
          <Button onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} disabled={idx === steps.length - 1} variant="outline" size="sm"><SkipForward className="h-4 w-4" /></Button>
        </div>
        <span className="text-sm text-muted-foreground">Step {idx + 1} / {steps.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${step.phase === 'encode' ? 'bg-blue-500/20 text-blue-600' : 'bg-green-500/20 text-green-600'}`}>{step.phase.toUpperCase()}</div>
          <div className="flex gap-2 mb-4">{step.strs.map((s, i) => <div key={i} className="px-4 py-2 rounded border-2 font-mono bg-muted/50 border-border">"{s}"</div>)}</div>
          {step.encoded && <div className="p-4 bg-blue-500/10 rounded mb-4 font-mono text-sm">"{step.encoded}"</div>}
          {step.decoded.length > 0 && <div className="flex gap-2">{step.decoded.map((s, i) => <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-4 py-2 rounded font-mono bg-green-500/20 border-2 border-green-500/30">"{s}"</motion.div>)}</div>}
          <Card className="p-4 mt-4 bg-primary/5"><p className="text-sm">{step.message}</p></Card>
        </Card>

        <Card className="p-4"><div className="h-[500px]"><Editor height="100%" defaultLanguage="typescript" value={`function encode(strs: string[]): string {\n  let result = '';\n  for (const str of strs) {\n    result += str.length + '#' + str;\n  }\n  return result;\n}\n\nfunction decode(s: string): string[] {\n  const result: string[] = [];\n  let i = 0;\n  \n  while (i < s.length) {\n    let j = i;\n    while (s[j] !== '#') j++;\n    const length = parseInt(s.substring(i, j));\n    const str = s.substring(j + 1, j + 1 + length);\n    result.push(str);\n    i = j + 1 + length;\n  }\n  \n  return result;\n}`} theme="vs-dark" options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }} onMount={(e, m) => { ref.current = e; monaco.current = m; }} /></div></Card>
      </div>

      <style>{`.highlighted-line { background: rgba(59, 130, 246, 0.15); border-left: 3px solid rgb(59, 130, 246); }`}</style>
    </div>
  );
};