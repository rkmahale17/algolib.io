import React, { useEffect, useRef } from 'react';

interface IsolatedSolutionEditorProps {
  code: string;
  language: string;
  theme: 'vs-dark' | 'light';
  path?: string;
}

export const IsolatedSolutionEditor: React.FC<IsolatedSolutionEditorProps> = ({
  code,
  language,
  theme,
  path
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);


  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body, html, #editor-container {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            background: ${theme === 'vs-dark' ? '#1e1e1e' : '#ffffff'};
          }
        </style>
      </head>
      <body>
        <div id="editor-container"></div>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs/loader.js"></script>
        <script>
          require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.54.0/min/vs' } });
          require(['vs/editor/editor.main'], function () {
            const editor = window.monaco.editor.create(document.getElementById('editor-container'), {
              value: ${JSON.stringify(code)},
              language: '${language}',
              theme: '${theme}',
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              lineNumbers: 'on',
              renderLineHighlight: 'none',
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            });

            window.addEventListener('message', (event) => {
              const { type, data } = event.data;
              if (type === 'UPDATE_CODE') {
                editor.setValue(data.code);
              } else if (type === 'UPDATE_LANGUAGE') {
                window.monaco.editor.setModelLanguage(editor.getModel(), data.language);
              } else if (type === 'UPDATE_THEME') {
                window.monaco.editor.setTheme(data.theme);
                document.body.style.background = data.theme === 'vs-dark' ? '#1e1e1e' : '#ffffff';
              }
            });

            // Notify parent that we are ready
            window.parent.postMessage({ type: 'EDITOR_READY' }, '*');
          });
        </script>
      </body>
    </html>
  `;

  // Update theme/code/language when props change without reloading the iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_CODE',
        data: { code }
      }, '*');
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_LANGUAGE',
        data: { language }
      }, '*');
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_THEME',
        data: { theme }
      }, '*');
    }
  }, [code, language, theme]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      title="Solution Editor"
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
    />
  );
};
