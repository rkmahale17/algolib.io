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
  onShortcut?: (key: string) => void;
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
  primaryColor = '#3e72ff',
  onShortcut
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
  const lastEmittedCodeRef = useRef(code);

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
        const newCode = event.data.data.code;
        lastEmittedCodeRef.current = newCode;
        onChange?.(newCode);
      } else if (event.data.type === 'KEYBOARD_SHORTCUT') {
        onShortcut?.(event.data.data.key);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, theme, readOnly, fontSize, highlightedLines, options, primaryColor, onReady]);

  useEffect(() => {
    if (isInternalReady && iframeRef.current?.contentWindow) {
      const currentVal = code.replace(/\r\n/g, '\n');
      const lastEmitted = (lastEmittedCodeRef.current || '').replace(/\r\n/g, '\n');

      if (currentVal !== lastEmitted) {
        console.log('[IsolatedCodeEditor] Content mismatch, sending UPDATE_CODE. Prop length:', currentVal.length, 'Last emitted length:', lastEmitted.length);
        iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CODE', data: { code } }, '*');
      }
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
