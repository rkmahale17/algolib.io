import { Monaco } from "@monaco-editor/react";

export const NIGHT_OWL_THEME = {
    base: 'vs-dark' as const,
    inherit: true,
    rules: [
        { token: '', foreground: 'ffffff', background: '011627' }, // White text default (mimics black text in light theme)
        { token: 'comment', foreground: '7a7a7a', fontStyle: '' }, // No italics
        { token: 'keyword', foreground: '569cd6', fontStyle: '' }, // VS Dark Blue (Standard) - No italics
        { token: 'operator', foreground: 'd4d4d4' },
        { token: 'storage', foreground: '569cd6', fontStyle: '' },
        { token: 'string', foreground: 'ce9178' }, // Standard VS Dark String
        { token: 'constant', foreground: 'b5cea8' },
        { token: 'number', foreground: 'b5cea8' },
        { token: 'boolean', foreground: '569cd6' },
        { token: 'class', foreground: '4ec9b0' },
        { token: 'function', foreground: 'dcdcaa' },
        { token: 'type', foreground: '4ec9b0' },
        { token: 'variable', foreground: '9cdcfe' },
        { token: 'variable.parameter', foreground: '9cdcfe' },
    ],
    colors: {
        'editor.background': '#011627',
        'editor.foreground': '#d6deeb', // Keep readable foreground default just in case
        'editor.lineHighlightBackground': '#0003',
        'editor.selectionBackground': '#5f7e9779',
        'editorCursor.foreground': '#80a4c2',
        'editorWhitespace.foreground': '#2e2041',
        'editorIndentGuide.background': '#5f7e9740',
        'editor.lineHighlightBorder': '#00000000',
    }
};

export const defineThemes = (monaco: Monaco) => {
    monaco.editor.defineTheme('night-owl', NIGHT_OWL_THEME);
};
