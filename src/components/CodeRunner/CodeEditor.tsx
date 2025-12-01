import React from 'react';
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  onMount?: OnMount;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  code,
  onChange,
  onMount
}) => {
  const { theme } = useTheme();

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

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-input bg-background">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={onChange}
        onMount={onMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontLigatures: true,
          tabSize: 2,
          insertSpaces: true,
          // Ensure numeric keys work properly
          quickSuggestions: true,
          acceptSuggestionOnCommitCharacter: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
        }}
      />
    </div>
  );
};
