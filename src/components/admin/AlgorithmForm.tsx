import {
  useCreateAlgorithm,
  useUpdateAlgorithm,
} from "@/hooks/useAlgorithms";
import { Algorithm } from "@/types/algorithm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { InputSchemaEditor } from "./InputSchemaEditor";

interface AlgorithmFormProps {
  algorithm?: Algorithm | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AlgorithmForm({
  algorithm,
  onCancel,
  onSuccess,
}: AlgorithmFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [listType, setListType] = useState("coreAlgo");
  const [unordered, setUnordered] = useState(false);

  const [multiExpected, setMultiExpected] = useState(false);
  const [returnModifiedInput, setReturnModifiedInput] = useState(false);
  const [modifiedInputIndex, setModifiedInputIndex] = useState(0);

  const createMutation = useCreateAlgorithm();
  const updateMutation = useUpdateAlgorithm();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: algorithm || {
      id: "",
      name: "",
      title: "",
      category: "",
      difficulty: "easy",
      description: "",
      explanation: "{}",
      implementations: "{}",
      problems_to_solve: "{}",
      test_cases: "[]",
      input_schema: "[]",
      tutorials: "[]",
      metadata: "{}",
    },
  });

  // Reset form when algorithm changes
  useEffect(() => {
    if (algorithm) {
      const metadataObj = typeof algorithm.metadata === 'string' 
        ? JSON.parse(algorithm.metadata) 
        : algorithm.metadata;
      
      setListType(metadataObj?.listType || "coreAlgo");
      setUnordered(!!metadataObj?.unordered);

      setMultiExpected(!!metadataObj?.multi_expected);
      setReturnModifiedInput(!!metadataObj?.return_modified_input);
      setModifiedInputIndex(metadataObj?.modified_input_index !== undefined ? metadataObj.modified_input_index : 0);

      reset({
        ...algorithm,
        explanation:
          typeof algorithm.explanation === "string"
            ? algorithm.explanation
            : JSON.stringify(algorithm.explanation),
        implementations:
          typeof algorithm.implementations === "string"
            ? algorithm.implementations
            : JSON.stringify(algorithm.implementations),
        problems_to_solve:
          typeof algorithm.problems_to_solve === "string"
            ? algorithm.problems_to_solve
            : JSON.stringify(algorithm.problems_to_solve),
        test_cases:
          typeof algorithm.test_cases === "string"
            ? algorithm.test_cases
            : JSON.stringify(algorithm.test_cases),
        input_schema:
          typeof algorithm.input_schema === "string"
            ? algorithm.input_schema
            : JSON.stringify(algorithm.input_schema),
        tutorials:
          typeof algorithm.tutorials === "string"
            ? algorithm.tutorials
            : JSON.stringify(algorithm.tutorials),
        metadata:
          typeof algorithm.metadata === "string"
            ? algorithm.metadata
            : JSON.stringify(algorithm.metadata),
      });

    } else {
      setListType("coreAlgo");
      setUnordered(false);

      setMultiExpected(false);
      setReturnModifiedInput(false);
      setModifiedInputIndex(0);
      reset({
        id: "",
        name: "",
        title: "",
        category: "",
        difficulty: "easy",
        description: "",
        explanation: "{}",
        implementations: "{}",
        problems_to_solve: "{}",
        test_cases: "[]",
        input_schema: "[]",
        tutorials: "[]",
        metadata: "{}",
      });
    }
    setJsonErrors({});
    setActiveTab("basic");
  }, [algorithm, reset]);

  // Validate JSON fields
  const validateJSON = (field: string, value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    } catch (e) {
      setJsonErrors((prev) => ({
        ...prev,
        [field]: `Invalid JSON: ${(e as Error).message}`,
      }));
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    // Validate all JSON fields
    const jsonFields = [
      "explanation",
      "implementations",
      "problems_to_solve",
      "test_cases",
      "input_schema",
      "tutorials",
      "metadata",
    ];
    let hasErrors = false;

    for (const field of jsonFields) {
      if (!validateJSON(field, data[field])) {
        hasErrors = true;
      }
    }

    if (hasErrors) {
      toast.error("Please fix JSON validation errors before submitting");
      return;
    }

    // Parse JSON fields
    const parsedData = {
      ...data,
      explanation: JSON.parse(data.explanation),
      implementations: JSON.parse(data.implementations),
      problems_to_solve: JSON.parse(data.problems_to_solve),
      test_cases: JSON.parse(data.test_cases),
      input_schema: JSON.parse(data.input_schema),
      tutorials: JSON.parse(data.tutorials),
      metadata: {
        ...JSON.parse(data.metadata),
        listType: listType, // Include listType from state
        unordered: unordered,
        multi_expected: multiExpected,
        return_modified_input: returnModifiedInput,
        modified_input_index: returnModifiedInput ? modifiedInputIndex : undefined,
      },
    };

    try {
      if (algorithm) {
        // Update - only send changed fields
        await updateMutation.mutateAsync({
          id: algorithm.id,
          updates: parsedData,
        });
      } else {
        // Create
        await createMutation.mutateAsync(parsedData);
      }
      onSuccess();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="bg-background border rounded-lg shadow-sm w-[100vw]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          {algorithm ? "Edit Algorithm" : "Create New Algorithm"}
        </h2>
        <p className="text-muted-foreground">
          Fill in all the fields to {algorithm ? "update" : "create"} the
          algorithm
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID *</Label>
                <Input
                  id="id"
                  {...register("id", { required: "ID is required" })}
                  disabled={!!algorithm}
                  placeholder="e.g., two-pointers"
                />
                {errors.id && (
                  <p className="text-sm text-destructive">
                    {errors.id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g., Two Pointers"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g., Two Pointers"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  placeholder="e.g., Arrays & Strings"
                />
                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select
                  value={watch("difficulty")}
                  onValueChange={(value) => setValue("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="list_type">List Type *</Label>
                <Select
                  value={listType}
                  onValueChange={(value) => setListType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core Pattern</SelectItem>
                    <SelectItem value="blind75">Blind 75</SelectItem>
                    <SelectItem value="core+blind75">Core + Blind 75</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Brief description of the algorithm"
                rows={3}
              />
            </div>
          </TabsContent>

          {/* Explanation Tab */}
          <TabsContent value="explanation" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (JSON) *</Label>
              <Textarea
                id="explanation"
                {...register("explanation", {
                  required: "Explanation is required",
                })}
                placeholder='{"problemStatement": "", "steps": [], "useCase": "", "tips": [], "constraints": [], "note": "", "io": []}'
                rows={15}
                className="font-mono text-sm"
                onBlur={(e) => validateJSON("explanation", e.target.value)}
              />
              {jsonErrors.explanation && (
                <p className="text-sm text-destructive">
                  {jsonErrors.explanation}
                </p>
              )}
              {errors.explanation && (
                <p className="text-sm text-destructive">
                  {errors.explanation?.message as string}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Should include: problemStatement, steps, useCase, tips,
                constraints, note, io
              </p>
            </div>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="implementations">Implementations (JSON) *</Label>
              <Textarea
                id="implementations"
                {...register("implementations", {
                  required: "Implementations are required",
                })}
                placeholder='[{"lang": "typeScript", "code": [{"codeType": "optimize", "code": "..."}, {"codeType": "starter", "code": "..."}]}]'
                rows={15}
                className="font-mono text-sm"
                onBlur={(e) => validateJSON("implementations", e.target.value)}
              />
              {jsonErrors.implementations && (
                <p className="text-sm text-destructive">
                  {jsonErrors.implementations}
                </p>
              )}
              {errors.implementations && (
                <p className="text-sm text-destructive">
                  {errors.implementations?.message as string}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Array of implementations for each language (typeScript, python,
                java, cpp)
              </p>
            </div>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="test_cases">Test Cases (JSON Array) *</Label>
              <Textarea
                id="test_cases"
                {...register("test_cases", {
                  required: "Test cases are required",
                })}
                placeholder='[{"input": [...], "output": ..., "expectedOutput": ..., "description": "..."}]'
                rows={10}
                className="font-mono text-sm"
                onBlur={(e) => validateJSON("test_cases", e.target.value)}
              />
              {jsonErrors.test_cases && (
                <p className="text-sm text-destructive">
                  {jsonErrors.test_cases}
                </p>
              )}
              {errors.test_cases && (
                <p className="text-sm text-destructive">
                  {errors.test_cases?.message as string}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/30">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="unordered-toggle" className="font-semibold">Unordered Comparison</Label>
                        <Switch 
                            id="unordered-toggle" 
                            checked={unordered} 
                            onCheckedChange={setUnordered} 
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        If enabled, array results will be sorted before comparison. Useful for problems like "Find All Subsets" where order doesn't matter.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="multi-expected-toggle" className="font-semibold">Multiple Valid Outputs</Label>
                        <Switch 
                            id="multi-expected-toggle" 
                            checked={multiExpected} 
                            onCheckedChange={setMultiExpected} 
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        If enabled, "expectedOutput" should be an array of valid results. Code passes if actual matches ANY variant.
                    </p>
                </div>

            </div>

            {/* In-Place Algorithm Section moved to InputSchemaEditor */}
            <div className="space-y-2">
              <Label>Input Schema</Label>
              <InputSchemaEditor
                schema={(() => {
                  try {
                    const parsed = JSON.parse(watch("input_schema") || "[]");
                    return parsed.map((f: any, i: number) => ({
                      ...f,
                      inplace: returnModifiedInput && modifiedInputIndex === i
                    }));
                  } catch {
                    return [];
                  }
                })()}
                onChange={(newSchema) => {
                  setValue("input_schema", JSON.stringify(newSchema), { shouldValidate: true });
                  
                  const inplaceIndex = newSchema.findIndex((f) => f.inplace);
                  if (inplaceIndex !== -1) {
                    setReturnModifiedInput(true);
                    setModifiedInputIndex(inplaceIndex);
                  } else {
                    setReturnModifiedInput(false);
                    setModifiedInputIndex(0);
                  }
                }}
              />
              <input type="hidden" {...register("input_schema", { required: "Input schema is required" })} />
              {jsonErrors.input_schema && (
                <p className="text-sm text-destructive">
                  {jsonErrors.input_schema}
                </p>
              )}
              {errors.input_schema && (
                <p className="text-sm text-destructive">
                  {errors.input_schema?.message as string}
                </p>
              )}
            </div>
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tutorials">Tutorials (JSON Array)</Label>
              <Textarea
                id="tutorials"
                {...register("tutorials")}
                placeholder='[{"type": "youtube", "url": "...", "credits": "...", "moreInfo": "..."}]'
                rows={6}
                className="font-mono text-sm"
                onBlur={(e) => validateJSON("tutorials", e.target.value)}
              />
              {jsonErrors.tutorials && (
                <p className="text-sm text-destructive">
                  {jsonErrors.tutorials}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="problems_to_solve">
                Problems to Solve (JSON)
              </Label>
              <Textarea
                id="problems_to_solve"
                {...register("problems_to_solve")}
                placeholder='{"internal": [], "external": [{"type": "easy", "url": "...", "title": "..."}]}'
                rows={8}
                className="font-mono text-sm"
                onBlur={(e) =>
                  validateJSON("problems_to_solve", e.target.value)
                }
              />
              {jsonErrors.problems_to_solve && (
                <p className="text-sm text-destructive">
                  {jsonErrors.problems_to_solve}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Additional Metadata (JSON)</Label>
              <Textarea
                id="metadata"
                {...register("metadata")}
                placeholder='{"likes": 0, "dislikes": 0, "visualizationUrl": "", "companyTags": [], "overview": "", "timeComplexity": "", "spaceComplexity": "", ...}'
                rows={10}
                className="font-mono text-sm"
                onBlur={(e) => validateJSON("metadata", e.target.value)}
              />
              {jsonErrors.metadata && (
                <p className="text-sm text-destructive">
                  {jsonErrors.metadata}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Includes: likes, dislikes, visualizationUrl, companyTags,
                overview, timeComplexity, spaceComplexity, availableLanguages,
                editorialId, userCompletionGraphData, shareCount, imageUrls
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {algorithm ? "Update" : "Create"} Algorithm
          </Button>
        </div>
      </form>
    </div>
  );
}
