import { useEffect, useRef } from 'react';
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
  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Clear previous decorations
    editor.deltaDecorations(
      editor.getModel().getAllDecorations().map((d: any) => d.id),
      []
    );

    // Add new decorations for highlighted lines
    if (highlightedLines.length > 0) {
      const decorations = highlightedLines.map(lineNumber => ({
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

      editor.deltaDecorations([], decorations);

      // Scroll to highlighted line
      if (highlightedLines.length > 0) {
        editor.revealLineInCenter(highlightedLines[0]);
      }
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
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
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
