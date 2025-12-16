import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TestCase {
  input: any[];
  expectedOutput: any;
  output?: any;
  description: string;
  isSubmission?: boolean;
}

interface TestCaseEditorProps {
  testCases: TestCase[];
  inputSchema: Array<{ name: string; type: string; label: string }>;
  onChange: (testCases: TestCase[]) => void;
}

// Helper component to manage input state locally
function TestCaseInput({ 
  label, 
  type, 
  value, 
  onChange 
}: { 
  label: string; 
  type: string; 
  value: any; 
  onChange: (val: any) => void;
}) {
  const [localValue, setLocalValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = isEditing 
    ? localValue 
    : (type.includes("[]") || type === "object" 
        ? (typeof value === 'string' ? value : JSON.stringify(value)) 
        : (value ?? ""));

  const handleFocus = () => {
    setIsEditing(true);
    // Initialize with the current display value (raw string or compact JSON)
    // blocking the "auto-format to 2 spaces" behavior
    if (type.includes("[]") || type === "object") {
        setLocalValue(typeof value === 'string' ? value : JSON.stringify(value));
    } else {
        setLocalValue(String(value ?? ""));
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (type.includes("[]") || type === "object") {
      try {
        // Normalize unicode minus to standard hyphen
        const normalized = localValue.replace(/−/g, '-');
        const parsed = JSON.parse(normalized);
        onChange(parsed);
      } catch {
        // If parsing fails, pass raw string to parent (or handle error)
        // For now, let's specific fallback or user re-entry
        onChange(localValue);
      }
    } else {
      const numVal = Number(localValue);
      onChange(isNaN(numVal) ? localValue : numVal);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {type.includes("[]") || type === "object" ? (
         <Textarea
            value={displayValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={`Enter ${type} as JSON`}
            rows={3}
            className="font-mono text-sm"
         />
      ) : (
         <Input
            value={displayValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={`Enter ${type}`}
            type={type === "number" ? "number" : "text"}
         />
      )}
    </div>
  );
}

export function TestCaseEditor({
  testCases,
  inputSchema,
  onChange,
}: TestCaseEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newTestCase: TestCase = {
      input: inputSchema.map(() => null),
      expectedOutput: null,
      description: "",
      isSubmission: false,
    };
    onChange([...testCases, newTestCase]);
    setExpandedIndex(testCases.length);
  };

  const handleRemove = (index: number) => {
    onChange(testCases.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleUpdate = (index: number, updates: Partial<TestCase>) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Test Cases</h3>
          <p className="text-sm text-muted-foreground">
            Define test cases to validate the algorithm
          </p>
        </div>
      </div>

      {testCases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No test cases defined. Click "Add Test Case" to get started.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {testCases.map((testCase, index) => (
          <Card key={index}>
            <CardHeader
              className="cursor-pointer hover:bg-muted/50"
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Test Case {index + 1}
                  
                  {testCase.isSubmission && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                      Hidden
                    </span>
                  )}
                </CardTitle>
                <div className="flex gap-2">
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
              </div>
            </CardHeader>

            {expandedIndex === index && (
              <CardContent className="space-y-4">
                {/* Description */}
                {testCase.description && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                       {testCase.description}
                    </span>
                  )}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={testCase.description}
                    onChange={(e) =>
                      handleUpdate(index, { description: e.target.value })
                    }
                    placeholder="Brief description of this test case"
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id={`submission-${index}`}
                      checked={testCase.isSubmission || false}
                      onChange={(e) =>
                        handleUpdate(index, { isSubmission: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`submission-${index}`}>
                      Submission Only (Hidden from user)
                    </Label>
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Inputs</Label>
                  {inputSchema.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Define input schema first to add test inputs
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {inputSchema.map((field, inputIndex) => (
                        <TestCaseInput
                          key={`${field.name}-${inputIndex}`}
                          label={`${field.label} (${field.type})`}
                          type={field.type}
                          value={testCase.input[inputIndex]}
                          onChange={(newValue) => {
                            const updated = [...testCases];
                            const inputs = [...updated[index].input];
                            inputs[inputIndex] = newValue;
                            updated[index].input = inputs;
                            onChange(updated);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Expected Output */}
                <div className="space-y-2">
                  <Label>Expected Output</Label>
                  <div className="border rounded-md overflow-hidden">
                    <Editor
                      height="150px"
                      language="json"
                      value={JSON.stringify(testCase.output, null, 2)}
                      onChange={(value) => {
                        try {
                          const parsed = JSON.parse(value || "null");
                          handleUpdate(index, { output: parsed });
                        } catch {
                          // Invalid JSON, don't update
                        }
                      }}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: "off",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Add Button at the bottom */}
        <div className="flex justify-start">
             <Button type="button" onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Test Case
            </Button>
        </div>
      </div>
    </div>
  );
}
