interface CodeHighlighterProps {
  code: string;
  highlightedLine: number;
  language: string;
}

export const CodeHighlighter = ({ code, highlightedLine, language }: CodeHighlighterProps) => {
  const lines = code.split('\n');
  
  return (
    <div className="bg-muted/50 rounded-lg border border-border overflow-hidden">
      <div className="bg-muted px-4 py-2 border-b border-border">
        <span className="text-xs font-semibold text-foreground">{language}</span>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-sm p-4 min-w-max">
          {lines.map((line, index) => (
            <div
              key={index}
              className={`flex ${
                index === highlightedLine
                  ? 'bg-primary/20 border-l-2 border-primary'
                  : ''
              } transition-colors duration-300`}
            >
              <span className="inline-block min-w-[2.5rem] w-10 text-right pr-3 text-muted-foreground select-none shrink-0">
                {index + 1}
              </span>
              <code className={`flex-1 whitespace-pre ${index === highlightedLine ? 'font-bold' : ''}`}>
                {line || ' '}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
