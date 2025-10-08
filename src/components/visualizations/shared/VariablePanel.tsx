interface VariablePanelProps {
  variables: Record<string, any>;
}

export const VariablePanel = ({ variables }: VariablePanelProps) => {
  return (
    <div className="bg-muted/50 rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold mb-3 text-foreground">Variables</h3>
      <div className="space-y-2">
        {Object.entries(variables).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="font-mono text-muted-foreground">{key}</span>
            <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              {Array.isArray(value) ? `[${value.join(', ')}]` : value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
