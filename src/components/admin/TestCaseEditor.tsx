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
}

interface TestCaseEditorProps {
  testCases: TestCase[];
  inputSchema: Array<{ name: string; type: string; label: string }>;
  onChange: (testCases: TestCase[]) => void;
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

  const handleInputChange = (
    testIndex: number,
    inputIndex: number,
    value: string
  ) => {
    const updated = [...testCases];
    const inputs = [...updated[testIndex].input];

    // Try to parse as JSON for arrays/objects
    try {
      inputs[inputIndex] = JSON.parse(value);
    } catch {
      // If not valid JSON, store as string or number
      inputs[inputIndex] = isNaN(Number(value)) ? value : Number(value);
    }

    updated[testIndex].input = inputs;
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
        <Button type="button" onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Test Case
        </Button>
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
                  {testCase.description && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      - {testCase.description}
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
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={testCase.description}
                    onChange={(e) =>
                      handleUpdate(index, { description: e.target.value })
                    }
                    placeholder="Brief description of this test case"
                  />
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
                        <div key={inputIndex} className="space-y-2">
                          <Label>
                            {field.label} ({field.type})
                          </Label>
                          {field.type.includes("[]") ||
                          field.type === "object" ? (
                            <Textarea
                              value={JSON.stringify(
                                testCase.input[inputIndex] || "",
                                null,
                                2
                              )}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  inputIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${field.type} as JSON`}
                              rows={3}
                              className="font-mono text-sm"
                            />
                          ) : (
                            <Input
                              value={testCase.input[inputIndex] ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  inputIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Enter ${field.type}`}
                              type={field.type === "number" ? "number" : "text"}
                            />
                          )}
                        </div>
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
      </div>
    </div>
  );
}
