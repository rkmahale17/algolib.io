import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Algorithm,
  useCreateAlgorithm,
  useUpdateAlgorithm,
} from "@/hooks/useAlgorithms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

// Import all editor components
import { ExplanationEditor } from "./ExplanationEditor";
import { CodeImplementationEditor } from "./CodeImplementationEditor";
import { TestCaseEditor } from "./TestCaseEditor";
import { InputSchemaEditor } from "./InputSchemaEditor";
import { MetadataEditor } from "./MetadataEditor";
import { ProblemsEditor } from "./ProblemsEditor";
import { AlgorithmPreview } from "./AlgorithmPreview";

interface AlgorithmFormBuilderProps {
  algorithm?: Algorithm | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AlgorithmFormBuilder({
  algorithm,
  onCancel,
  onSuccess,
}: AlgorithmFormBuilderProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [listType, setListType] = useState("coreAlgo");

  const createMutation = useCreateAlgorithm();
  const updateMutation = useUpdateAlgorithm();

  // Form state
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    title: "",
    category: "",
    difficulty: "easy",
    description: "",
    explanation: {
      problemStatement: "",
      useCase: "",
      note: "",
      steps: [],
      tips: [],
      constraints: [],
      io: [],
    },
    implementations: [],
    test_cases: [],
    input_schema: [],
    metadata: {
      overview: "",
      timeComplexity: "",
      spaceComplexity: "",
      companyTags: [],
      visualizationUrl: "",
      likes: 0,
      dislikes: 0,
    },
    problems_to_solve: {
      internal: [],
      external: [],
    },
    tutorials: [],
  });

  // Load algorithm data when editing
  useEffect(() => {
    if (algorithm) {
      const metadataObj =
        typeof algorithm.metadata === "string"
          ? JSON.parse(algorithm.metadata)
          : algorithm.metadata;
      setListType(metadataObj?.listType || "coreAlgo");

      setFormData({
        id: algorithm.id,
        name: algorithm.name,
        title: algorithm.title,
        category: algorithm.category,
        difficulty: algorithm.difficulty,
        description: algorithm.description || "",
        explanation:
          typeof algorithm.explanation === "string"
            ? JSON.parse(algorithm.explanation)
            : algorithm.explanation,
        implementations:
          typeof algorithm.implementations === "string"
            ? JSON.parse(algorithm.implementations)
            : algorithm.implementations,
        test_cases:
          typeof algorithm.test_cases === "string"
            ? JSON.parse(algorithm.test_cases)
            : algorithm.test_cases,
        input_schema:
          typeof algorithm.input_schema === "string"
            ? JSON.parse(algorithm.input_schema)
            : algorithm.input_schema,
        metadata: metadataObj,
        problems_to_solve:
          typeof algorithm.problems_to_solve === "string"
            ? JSON.parse(algorithm.problems_to_solve)
            : algorithm.problems_to_solve,
        tutorials:
          typeof algorithm.tutorials === "string"
            ? JSON.parse(algorithm.tutorials)
            : algorithm.tutorials,
      });
    }
  }, [algorithm]);

  const handleSave = async () => {
    // Validation
    if (!formData.id || !formData.name || !formData.title) {
      toast.error("Please fill in all required fields (ID, Name, Title)");
      return;
    }

    const payload = {
      ...formData,
      metadata: {
        ...formData.metadata,
        listType: listType,
      },
    };

    try {
      if (algorithm) {
        await updateMutation.mutateAsync({
          id: algorithm.id,
          updates: payload,
        });
        toast.success("Algorithm updated successfully!");
        // Don't navigate away, stay on the page
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Algorithm created successfully!");
        onSuccess(); // Navigate away only for new algorithms
      }
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background pb-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">
            {algorithm ? "Edit Algorithm" : "Create New Algorithm"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details below
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
        {/* Left Side - Form */}
        <div className="space-y-6">

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 h-auto">
            <TabsTrigger value="basic" className="text-xs">
              Basic
            </TabsTrigger>
            <TabsTrigger value="explanation" className="text-xs">
              Explanation
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">
              Code
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs">
              Tests
            </TabsTrigger>
            <TabsTrigger value="metadata" className="text-xs">
              Metadata
            </TabsTrigger>
            <TabsTrigger value="problems" className="text-xs">
              Problems
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    ID * <span className="text-xs text-muted-foreground">(URL-friendly)</span>
                  </Label>
                  <Input
                    value={formData.id}
                    onChange={(e) =>
                      setFormData({ ...formData, id: e.target.value })
                    }
                    placeholder="e.g., two-pointers"
                    disabled={!!algorithm}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Two Pointers"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Two Pointers"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Arrays & Strings"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData({ ...formData, difficulty: value })
                    }
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
                  <Label>List Type *</Label>
                  <Select value={listType} onValueChange={setListType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coreAlgo">Core Algorithm</SelectItem>
                      <SelectItem value="blind75">Blind 75</SelectItem>
                      <SelectItem value="core+Blind75">Core + Blind 75</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Explanation Tab */}
          <TabsContent value="explanation" className="mt-4">
            <ExplanationEditor
              data={formData.explanation}
              onChange={(explanation) =>
                setFormData({ ...formData, explanation })
              }
            />
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="mt-4">
            <CodeImplementationEditor
              implementations={formData.implementations}
              onChange={(implementations) =>
                setFormData({ ...formData, implementations })
              }
            />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="mt-4 space-y-6">
            <InputSchemaEditor
              schema={formData.input_schema}
              onChange={(input_schema) =>
                setFormData({ ...formData, input_schema })
              }
            />
            <TestCaseEditor
              testCases={formData.test_cases}
              inputSchema={formData.input_schema}
              onChange={(test_cases) =>
                setFormData({ ...formData, test_cases })
              }
            />
          </TabsContent>

          {/* Metadata Tab */}
          <TabsContent value="metadata" className="mt-4">
            <MetadataEditor
              data={formData.metadata}
              onChange={(metadata) => setFormData({ ...formData, metadata })}
            />
          </TabsContent>

          {/* Problems Tab */}
          <TabsContent value="problems" className="mt-4">
            <ProblemsEditor
              data={formData.problems_to_solve}
              onChange={(problems_to_solve) =>
                setFormData({ ...formData, problems_to_solve })
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Preview */}
      <div className="hidden lg:block">
        <AlgorithmPreview algorithm={formData} />
      </div>
    </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-full border bg-background/80 backdrop-blur-md shadow-lg">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="gap-2 rounded-full"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="gap-2 rounded-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {algorithm ? "Update" : "Create"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
