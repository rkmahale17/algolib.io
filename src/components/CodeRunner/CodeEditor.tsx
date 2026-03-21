import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from "next-themes";
import { IsolatedCodeEditor } from '../visualizations/shared/IsolatedCodeEditor';

export interface CodeEditorRef {
  formatCode: () => void;
  setErrors: (errors: Array<{ line: number; column?: number; message: string }>) => void;
  layout: () => void;
}

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  onMount?: (editor: any) => void;
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
  const isolatedEditorRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    formatCode: () => {
      isolatedEditorRef.current?.formatCode();
    },
    setErrors: (errors) => {
      isolatedEditorRef.current?.setErrors(errors);
    },
    layout: () => {
      isolatedEditorRef.current?.layout();
    }
  }));

  // Determine effective theme
  const monacoTheme = customTheme
    ? (customTheme === 'dark' ? 'vs-dark' : (customTheme === 'light' ? 'light' : (systemTheme === 'dark' ? 'vs-dark' : 'light')))
    : (systemTheme === 'dark' ? 'vs-dark' : 'light');

  // Map our language names to Monaco language IDs
  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'typescript': return 'typescript';
      case 'javascript': return 'javascript';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      case 'python': return 'python';
      default: return 'typescript';
    }
  };

  return (
    <div className={`h-full w-full overflow-hidden bg-background min-h-[300px] `}>
      <IsolatedCodeEditor
        ref={isolatedEditorRef}
        code={code}
        language={getMonacoLanguage(language)}
        theme={monacoTheme as any}
        onChange={onChange}
        readOnly={customOptions?.readOnly ?? false}
        fontSize={customOptions?.fontSize || 15}
        options={{
          minimap: { enabled: false },
          lineNumbers: customOptions?.lineNumbers || 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          tabSize: customOptions?.tabSize || 2,
          detectIndentation: false,
          insertSpaces: true,
          wordWrap: customOptions?.wordWrap || 'off',
          quickSuggestions: customOptions?.autocomplete !== false,
          suggestOnTriggerCharacters: customOptions?.autocomplete !== false,
          parameterHints: { enabled: customOptions?.autocomplete !== false },
          tabCompletion: customOptions?.autocomplete !== false ? 'on' : 'off',
          wordBasedSuggestions: customOptions?.autocomplete !== false ? 'currentDocument' : 'off',
          acceptSuggestionOnCommitCharacter: customOptions?.autocomplete !== false,
          acceptSuggestionOnEnter: customOptions?.autocomplete !== false ? 'on' : 'off',
        }}
        className={isMobile ? "min-h-[300px]" : ""}
      />
    </div>
  );
});

CodeEditor.displayName = "CodeEditor";
