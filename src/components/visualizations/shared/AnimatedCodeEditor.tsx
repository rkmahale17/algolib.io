import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface AnimatedCodeEditorProps {
  code: string;
  language: string;
  highlightedLines?: number[];
  className?: string;
}

export const AnimatedCodeEditor = ({ 
  code, 
  language, 
  highlightedLines = [],
  className = '' 
}: AnimatedCodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const { theme, resolvedTheme } = useTheme();
  const [decorations, setDecorations] = useState<string[]>([]);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Clear previous decorations
    const newDecorations = decorations.length > 0 
      ? editor.deltaDecorations(decorations, [])
      : [];

    // Add new decorations for highlighted lines
    if (highlightedLines.length > 0) {
      const newDecs = highlightedLines.map(lineNumber => ({
        range: {
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: model.getLineMaxColumn(lineNumber),
        },
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          glyphMarginClassName: 'highlighted-line-glyph',
        },
      }));

      const ids = editor.deltaDecorations(newDecorations, newDecs);
      setDecorations(ids);

      // Scroll to highlighted line smoothly
      if (highlightedLines.length > 0) {
        editor.revealLineInCenter(highlightedLines[0], 1);
      }
    } else {
      setDecorations([]);
    }
  }, [highlightedLines]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border border-border overflow-hidden ${className}`}
    >
      <div className="bg-muted px-4 py-2 border-b border-border">
        <span className="text-xs font-semibold text-foreground">{language}</span>
      </div>
      <Editor
        height="500px"
        language={language.toLowerCase()}
        value={code}
        theme={(resolvedTheme || theme) === 'dark' ? 'vs-dark' : 'light'}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          renderLineHighlight: 'none',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
          },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          folding: false,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          smoothScrolling: true,
        }}
      />
      <style>{`
        .highlighted-line {
          background-color: hsl(var(--primary) / 0.2) !important;
          border-left: 3px solid hsl(var(--primary)) !important;
          animation: highlightPulse 0.5s ease-out;
        }
        
        .highlighted-line-glyph {
          background-color: hsl(var(--primary)) !important;
          width: 4px !important;
        }

        @keyframes highlightPulse {
          0% {
            background-color: hsl(var(--primary) / 0.4);
          }
          100% {
            background-color: hsl(var(--primary) / 0.2);
          }
        }
      `}</style>
    </motion.div>
  );
};
