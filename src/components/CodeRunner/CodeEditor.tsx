import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Editor, { OnMount, BeforeMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import * as monaco from 'monaco-editor';
import { format } from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";
import { defineThemes } from "@/utils/monacoThemes";

export interface CodeEditorRef {
  formatCode: () => Promise<void>;
  setErrors: (errors: Array<{ line: number; column?: number; message: string }>) => void;
  layout: () => void;
}

// Basic formatter helper
const basicFormat = (code: string, language: string): string => {
  const lines = code.split('\n').map(line => line.trim());
  let formatted = '';
  let indentLevel = 0;
  const indentSize = 2; 

  if (language === 'python') return code; // Skip Python to avoid breaking logic

  for (const line of lines) {
    if (!line) {
        formatted += '\n';
        continue;
    }
    
    if (line.startsWith('}') || line.startsWith(']')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted += ' '.repeat(indentLevel * indentSize) + line + '\n';

    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    
    if (openBraces > closeBraces) {
        indentLevel++;
    }
  }
  return formatted;
};

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  onMount?: OnMount;
  options?: {
    fontSize?: number;
    wordWrap?: "on" | "off";
    tabSize?: number;
    minimap?: boolean;
    lineNumbers?: "on" | "off" | "relative" | "interval";
    readOnly?: boolean;
    autocomplete?: boolean;
  };
  theme?: string; // Explicit theme override
  path?: string; // Unique path for the model to prevent duplicates
  isMobile?: boolean; // Mobile flag for responsive sizing
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  language,
  code,
  onChange,
  onMount,
  options: customOptions,
  theme: customTheme,
  path,
  isMobile
}, ref) => {
  const { theme: systemTheme } = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    formatCode: async () => {
      if (!editorRef.current) return;

      const currentCode = editorRef.current.getValue();
      const needsPrettier = ['javascript', 'typescript'].includes(language);

      if (needsPrettier) {
        try {
          const formatted = await format(currentCode, {
            parser: language === 'typescript' ? 'babel-ts' : 'babel',
            plugins: [parserBabel, parserEstree],
            singleQuote: true,
            trailingComma: 'none',
          });
          editorRef.current.setValue(formatted);
        } catch (error) {
          console.error("Prettier formatting failed:", error);
           // Fallback to basic
           const formatted = basicFormat(currentCode, language);
           editorRef.current.setValue(formatted);
        }
      } else {
         // Custom basic formatter for Java/C++
         if (['java', 'cpp'].includes(language)) {
             const formatted = basicFormat(currentCode, language);
             editorRef.current.setValue(formatted);
         } else {
             editorRef.current.getAction('editor.action.formatDocument')?.run();
         }
      }
    },
    setErrors: (errors) => {
        if (!editorRef.current) return;
        const model = editorRef.current.getModel();
        if (!model) return;

        const markers = errors.map(e => ({
            startLineNumber: e.line,
            startColumn: e.column || 1,
            endLineNumber: e.line,
            endColumn: 1000,
            message: e.message,
            severity: monaco.MarkerSeverity.Error
        }));

        monaco.editor.setModelMarkers(model, "owner", markers);
    },
    layout: () => {
        editorRef.current?.layout();
    }

  }));

  const handleEditorDidMount: OnMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    if (onMount) {
      onMount(editor, monacoInstance);
    }
  };

  // Map our language names to Monaco language IDs
  const getMonacoLanguage = (lang: string) => {
    switch(lang) {
      case 'typescript': return 'typescript';
      case 'javascript': return 'javascript';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'typescript';
    }
  };

  // Determine effective theme
  const effectiveTheme = customTheme === 'dark' || (customTheme === 'system' && systemTheme === 'dark') 
    ? 'night-owl' 
    : 'light';

    // If customTheme is explicit 'light' or 'dark', use it. 
    // If it's 'system' (or undefined), fallback to next-themes 'theme'.
  const monacoTheme = customTheme 
      ? (customTheme === 'dark' ? 'night-owl' : (customTheme === 'light' ? 'light' : (systemTheme === 'dark' ? 'night-owl' : 'light')))
      : (systemTheme === 'dark' ? 'night-owl' : 'light');

  return (
    <div className={`h-full w-full overflow-hidden bg-background min-h-[300px] `}>
      <Editor
        height="100%"
        path={path}
        className={isMobile ? "min-h-[300px]" : ""}
        language={getMonacoLanguage(language)}
        value={code ?? ''}
        theme={monacoTheme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        beforeMount={defineThemes}
        options={{
          minimap: { enabled: false},
          fontSize: customOptions?.fontSize || 15,
          lineNumbers: customOptions?.lineNumbers || 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: customOptions?.readOnly ?? false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          tabSize: customOptions?.tabSize || 2,
          detectIndentation: false,
          insertSpaces: true,
          wordWrap: customOptions?.wordWrap || 'off',
          
          // Autocomplete settings
          quickSuggestions: customOptions?.autocomplete !== false,
          suggestOnTriggerCharacters: customOptions?.autocomplete !== false,
          parameterHints: { enabled: customOptions?.autocomplete !== false },
          tabCompletion: customOptions?.autocomplete !== false ? 'on' : 'off',
          wordBasedSuggestions: customOptions?.autocomplete !== false ? 'currentDocument' : 'off',
          acceptSuggestionOnCommitCharacter: customOptions?.autocomplete !== false,
          acceptSuggestionOnEnter: customOptions?.autocomplete !== false ? 'on' : 'off',
        }}
      />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";
