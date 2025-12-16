import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, LayoutList, AlignJustify } from "lucide-react";

import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

function BulkJsonEditor({
    label,
    value,
    onChange
}: {
    label: string,
    value: any[],
    onChange: (val: any[]) => void
}) {
    const stringValue = JSON.stringify(value, null, 2);

    const handleChange = (newValue: string | undefined) => {
        if (!newValue) return;
        try {
            const parsed = JSON.parse(newValue);
            if (Array.isArray(parsed)) {
                onChange(parsed);
            }
        } catch (e) {
            // Ignore parse errors while typing
        }
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="border rounded-md overflow-hidden h-[300px]">
                <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={stringValue}
                    onChange={handleChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        formatOnPaste: true,
                        formatOnType: true,
                    }}
                />
            </div>
             <p className="text-xs text-muted-foreground">
                Expects a JSON array of values, e.g. <code>[1, 2, 3]</code> or <code>[["a"], ["b"]]</code>
            </p>
        </div>
    )
}

export function TestCaseEditor({
  testCases,
  inputSchema,
  onChange,
}: TestCaseEditorProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "bulk">("list");

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

  // Bulk update specific input field (by index in schema)
  const handleBulkInputChange = (schemaIndex: number, newValues: any[]) => {
      const maxLen = Math.max(testCases.length, newValues.length);
      const updated = [];
      
      for(let i = 0; i < maxLen; i++) {
          const existing = testCases[i] || {
              input: inputSchema.map(() => null),
              expectedOutput: null,
              description: "",
              isSubmission: false,
          };
          
          const newInputs = [...existing.input];
          // If we have a value for this index, use it. usage of undefined check handled by simple assignment if array is big enough
          if (i < newValues.length) {
              newInputs[schemaIndex] = newValues[i];
          }
           
          updated.push({
              ...existing,
              input: newInputs
          });
      }
      onChange(updated);
  }

  const handleBulkOutputChange = (newValues: any[]) => {
       const maxLen = Math.max(testCases.length, newValues.length);
      const updated = [];
      
      for(let i = 0; i < maxLen; i++) {
          const existing = testCases[i] || {
              input: inputSchema.map(() => null),
              expectedOutput: null,
              description: "",
              isSubmission: false,
          };
          
          let newOutput = existing.output;
          if (i < newValues.length) {
              newOutput = newValues[i];
          }
           
          updated.push({
              ...existing,
              output: newOutput
          });
      }
      onChange(updated);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Test Cases</h3>
          <p className="text-sm text-muted-foreground">
            Define test cases to validate the algorithm
          </p>
        </div>
         <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "list" | "bulk")}>
            <ToggleGroupItem value="list" aria-label="List View">
                <LayoutList className="h-4 w-4 mr-2" />
                List
            </ToggleGroupItem>
            <ToggleGroupItem value="bulk" aria-label="Bulk View">
                <AlignJustify className="h-4 w-4 mr-2" />
                Bulk
            </ToggleGroupItem>
        </ToggleGroup>
      </div>

       {viewMode === 'bulk' ? (
           <div className="space-y-6">
               {inputSchema.length === 0 ? (
                    <div className="p-4 border border-dashed rounded-lg bg-muted/50 text-center text-muted-foreground">
                        <p>No input parameters defined.</p>
                        <p className="text-sm">Please define the <strong>Input Schema</strong> above to enable bulk input editing.</p>
                    </div>
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inputSchema.map((field, idx) => (
                            <BulkJsonEditor 
                                key={field.name}
                                label={`Input (${field.name})`}
                                value={testCases.map(tc => tc.input[idx])}
                                onChange={(vals) => handleBulkInputChange(idx, vals)}
                            />
                        ))}
                </div>
               )}
               
               <div className="border-t pt-4">
                    <BulkJsonEditor 
                        label="Expected Output"
                        value={testCases.map(tc => tc.output)}
                        onChange={handleBulkOutputChange}
                    />
               </div>
           </div>
       ) : (
           /* Normal List View */
           <>
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
           </>
       )}
    </div>
  );
}

