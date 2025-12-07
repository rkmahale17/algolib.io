import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import * as monaco from 'monaco-editor';
import { format } from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import parserEstree from "prettier/plugins/estree";

export interface CodeEditorRef {
  formatCode: () => Promise<void>;
}

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
  };
  theme?: string; // Explicit theme override
  path?: string; // Unique path for the model to prevent duplicates
}

export const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  language,
  code,
  onChange,
  onMount,
  options: customOptions,
  theme: customTheme,
  path
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
          // Fallback to Monaco default formatter
          editorRef.current.getAction('editor.action.formatDocument')?.run();
        }
      } else {
         // Default Monaco formatter for other languages
         editorRef.current.getAction('editor.action.formatDocument')?.run();
      }
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
    ? 'vs-dark' 
    : 'light';

    // If customTheme is explicit 'light' or 'dark', use it. 
    // If it's 'system' (or undefined), fallback to next-themes 'theme'.
  const monacoTheme = customTheme 
      ? (customTheme === 'dark' ? 'vs-dark' : (customTheme === 'light' ? 'light' : (systemTheme === 'dark' ? 'vs-dark' : 'light')))
      : (systemTheme === 'dark' ? 'vs-dark' : 'light');


  return (
    <div className="h-full w-full overflow-hidden bg-background">
      <Editor
        height="100%"
        path={path}
        language={getMonacoLanguage(language)}
        value={code}
        theme={monacoTheme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: customOptions?.minimap ?? false },
          fontSize: customOptions?.fontSize || 14,
          lineNumbers: customOptions?.lineNumbers || 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          tabSize: customOptions?.tabSize || 2,
          insertSpaces: true,
          wordWrap: customOptions?.wordWrap || 'off',
          quickSuggestions: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
        }}
      />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";
