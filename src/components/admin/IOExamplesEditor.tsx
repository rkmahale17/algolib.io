import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface IOExample {
  input: string;
  output: string;
  explanation: string;
}

interface IOExamplesEditorProps {
  examples: IOExample[];
  onChange: (examples: IOExample[]) => void;
}

export function IOExamplesEditor({ examples, onChange }: IOExamplesEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    onChange([...examples, { input: "", output: "", explanation: "" }]);
    setExpandedIndex(examples.length);
  };

  const handleRemove = (index: number) => {
    onChange(examples.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleUpdate = (index: number, field: keyof IOExample, value: string) => {
    const updated = [...examples];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Input/Output Examples</h4>
          <p className="text-sm text-muted-foreground">
            Add examples to illustrate the algorithm
          </p>
        </div>
        <Button type="button" onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Example
        </Button>
      </div>

      {examples.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          No examples yet. Click "Add Example" to get started.
        </div>
      )}

      <div className="space-y-3">
        {examples.map((example, index) => (
          <Card key={index}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">
                    Example {index + 1}
                    {example.input && (
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        - {example.input.substring(0, 40)}
                        {example.input.length > 40 ? "..." : ""}
                      </span>
                    )}
                  </CardTitle>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {expandedIndex === index && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Input *</Label>
                  <Input
                    value={example.input}
                    onChange={(e) => handleUpdate(index, "input", e.target.value)}
                    placeholder='e.g., nums = [2,7,11,15], target = 9'
                  />
                </div>

                <div className="space-y-2">
                  <Label>Output *</Label>
                  <Input
                    value={example.output}
                    onChange={(e) => handleUpdate(index, "output", e.target.value)}
                    placeholder="e.g., [0,1]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Explanation</Label>
                  <Textarea
                    value={example.explanation}
                    onChange={(e) => handleUpdate(index, "explanation", e.target.value)}
                    placeholder="Explain why this is the output... Use \n for line breaks"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use \n for line breaks in your explanation
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
