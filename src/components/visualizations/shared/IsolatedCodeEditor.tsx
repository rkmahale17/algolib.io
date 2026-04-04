import React, { useEffect, useRef, useState } from 'react';

interface IsolatedCodeEditorProps {
  code: string;
  language: string;
  theme: 'vs-dark' | 'light';
  highlightedLines?: number[];
  readOnly?: boolean;
  fontSize?: number;
  height?: string;
  onMount?: (editor: any) => void;
  onChange?: (value: string) => void;
  onReady?: () => void;
  options?: Record<string, any>;
  className?: string;
  primaryColor?: string;
}

export const IsolatedCodeEditor = React.forwardRef<any, IsolatedCodeEditorProps>(({
  code,
  language,
  theme,
  highlightedLines = [],
  readOnly = true,
  fontSize = 14,
  height = '100%',
  onMount,
  onChange,
  onReady,
  options = {},
  className = '',
  primaryColor = '#3e72ff'
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isInternalReady, setIsInternalReady] = useState(false);

  React.useImperativeHandle(ref, () => ({
    formatCode: () => {
      if (isInternalReady && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'FORMAT_CODE' }, '*');
      }
    },
    setErrors: (errors: any[]) => {
      if (isInternalReady && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'SET_ERRORS', data: { errors } }, '*');
      }
    },
    layout: () => {
      if (isInternalReady && iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'TRIGGER_LAYOUT' }, '*');
      }
    }
  }));
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'MONACO_LOADED') {
        // Iframe is loaded and Monaco is ready to be initialized
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({
            type: 'INIT_EDITOR',
            data: {
              code,
              language,
              theme,
              readOnly,
              fontSize,
              highlightedLines,
              options,
              primaryColor
            }
          }, '*');
        }
      } else if (event.data.type === 'EDITOR_READY') {
        setIsInternalReady(true);
        onReady?.();
      } else if (event.data.type === 'CODE_CHANGED') {
        onChange?.(event.data.data.code);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [code, language, theme, readOnly, fontSize, highlightedLines, options, primaryColor, onChange, onReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CODE', data: { code } }, '*');
    }
  }, [code, isInternalReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_LANGUAGE', data: { language } }, '*');
    }
  }, [language, isInternalReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_THEME', data: { theme } }, '*');
    }
  }, [theme, isInternalReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_PRIMARY_COLOR', data: { color: primaryColor } }, '*');
    }
  }, [primaryColor, isInternalReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_HIGHLIGHTS', data: { lines: highlightedLines } }, '*');
    }
  }, [highlightedLines, isInternalReady]);

  return (
    <iframe
      ref={iframeRef}
      src={`/monaco-editor-host.html?theme=${theme}`}
      title="Isolated Monaco Editor"
      className={`w-full h-full border-0 ${className}`}
      style={{ height }}
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
    />
  );
});

IsolatedCodeEditor.displayName = 'IsolatedCodeEditor';
