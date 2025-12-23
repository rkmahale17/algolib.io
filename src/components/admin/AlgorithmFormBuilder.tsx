import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateAlgorithm,
  useUpdateAlgorithm,
} from "@/hooks/useAlgorithms";
import { Algorithm } from "@/types/algorithm";
import { ListType, LIST_TYPE_OPTIONS } from "@/types/algorithm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

// Import all editor components
import { ExplanationEditor } from "./ExplanationEditor";
import { CodeImplementationEditor } from "./CodeImplementationEditor";
import { TestCaseEditor } from "./TestCaseEditor";
import { InputSchemaEditor } from "./InputSchemaEditor";
import { MetadataEditor } from "./MetadataEditor";
import { ProblemsEditor } from "./ProblemsEditor";
import { AlgorithmPreview } from "./AlgorithmPreview";
import { TutorialsEditor } from "./TutorialsEditor";
import { ControlsEditor, DEFAULT_CONTROLS } from "./ControlsEditor";
import { useNavigate } from "react-router-dom";
import { SmartFillDialog } from "./SmartFillDialog";

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
  const navigate = useNavigate();

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
    serial_no: "",
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
    controls: DEFAULT_CONTROLS,
  });

  // Load algorithm data when editing
  useEffect(() => {
    if (algorithm) {
      const metadataObj =
        typeof algorithm.metadata === "string"
          ? JSON.parse(algorithm.metadata)
          : algorithm.metadata;
      setListType(algorithm.list_type || metadataObj?.listType || "coreAlgo");

      setFormData({
        id: algorithm.id,
        name: algorithm.name,
        title: algorithm.title,
        category: algorithm.category,
        difficulty: algorithm.difficulty,
        description: algorithm.description || "",
        serial_no: algorithm.serial_no || "",
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
        controls: algorithm.controls || DEFAULT_CONTROLS,
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
      list_type: listType,
      serial_no: formData.serial_no ? parseInt(formData.serial_no) : null,
      metadata: {
        ...formData.metadata,
        // We can keep listType in metadata for backward compatibility if needed, 
        // but user requested "direct column instead of meta data".
        // Let's remove it from metadata if we want to be strict, or just ignore it.
        // For now, I'll update it to match just in case.
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

  const handleSmartFill = (data: any) => {
    setFormData((prev: any) => {
      // 1. Identify Protected Top-Level Fields
      // If previous value exists, keep it. Otherwise use new data.
      const protectedFields = [
        "id", "name", "title", "category", "difficulty", "serial_no", "description"
      ];
      
      const mergedTopLevel: any = {};
      protectedFields.forEach(field => {
        // If prev has value, keep it. Else take data.
        mergedTopLevel[field] = prev[field] ? prev[field] : (data[field] || "");
      });

      // 2. Metadata Protection
      // Protect: companyTags, likes, dislikes, timeComplexity, spaceComplexity
      const prevMeta = prev.metadata || {};
      const newMeta = data.metadata || {};
      
      const mergedMetadata = {
        ...newMeta, // Default to new
        // Restore protected if they exist in prev
        companyTags: (prevMeta.companyTags && prevMeta.companyTags.length > 0) ? prevMeta.companyTags : (newMeta.companyTags || []),
        likes: prevMeta.likes !== undefined ? prevMeta.likes : (newMeta.likes || 0),
        dislikes: prevMeta.dislikes !== undefined ? prevMeta.dislikes : (newMeta.dislikes || 0),
        timeComplexity: prevMeta.timeComplexity || newMeta.timeComplexity || "",
        spaceComplexity: prevMeta.spaceComplexity || newMeta.spaceComplexity || "",
        // Preserve other keys from prev that might not be in new?
        // Usually we want new overview.
        overview: newMeta.overview || prevMeta.overview || "",
      };

      // 3. Explanation Protection
      // User requested protecting "Complexity Analysis" (often in explanation or metadata)
      // Logic: Merge explanation fields.
      const prevExpl = prev.explanation || {};
      const newExpl = data.explanation || {};
      const mergedExplanation = {
        ...prevExpl,
        ...newExpl,
        // If we want to protect specific sub-fields (none explicitly requested besides complexity which is in metadata/explanation)
        // Ensure strictly structured fields are taken from NEW data properly
        comparisonTable: newExpl.comparisonTable || prevExpl.comparisonTable,
      };

      // 4. Implementations (Merge by codeType)
      const prevImpls = Array.isArray(prev.implementations) ? prev.implementations : [];
      const newImpls = Array.isArray(data.implementations) ? data.implementations : [];
      
      // Strategy:
      // 1. Create a map of existing implementations by Language.
      // 2. For each language, map code types.
      // 3. Merge new implementations into this structure (overwriting same codeType, adding new).
      
      const implMap = new Map<string, any[]>();
      
      // Load previous
      prevImpls.forEach((impl: any) => {
          if (impl.lang && Array.isArray(impl.code)) {
              implMap.set(impl.lang.toLowerCase(), [...impl.code]);
          }
      });
      
      // Merge new
      newImpls.forEach((newImpl: any) => {
          if (newImpl.lang && Array.isArray(newImpl.code)) {
              const langKey = newImpl.lang.toLowerCase();
              const existingCodes = implMap.get(langKey) || [];
              
              const mergedCodes = [...existingCodes];
              
              newImpl.code.forEach((newCode: any) => {
                  const existingIndex = mergedCodes.findIndex(c => c.codeType === newCode.codeType);
                  if (existingIndex >= 0) {
                      // Overwrite existing (unless it's starter? No, if generator sends starter it's usually valid stub)
                      // If prev was user-edited starter, maybe protect?
                      // But for now, Smart Fill usually implies "Update".
                      // Exception: If codeType is 'starter', we might want to preserve invalid user changes?
                      // User said "more generated approch will merge".
                      // So if it's a NEW approach, it appends. If it's existing, it updates.
                      mergedCodes[existingIndex] = newCode; 
                  } else {
                      mergedCodes.push(newCode);
                  }
              });
              
              implMap.set(langKey, mergedCodes);
          }
      });
      
      // Reconstruct array
      // Helper to restore canonical casing
      const normalizeLangKey = (key: string) => {
          if (key === 'typescript') return 'TypeScript';
          return key;
      };

      const mergedImpls = Array.from(implMap.entries()).map(([lang, code]) => ({
          lang: normalizeLangKey(lang),
          code
      }));
      
      // If we had no impls before, just take new (handled by logic above).
      // If we only have new impls (no prev), logic works.
      
      // 5. Protected Arrays/Lists
      // 'tutorials', 'problems_to_solve'
      const mergedTutorials = (prev.tutorials && prev.tutorials.length > 0) 
          ? prev.tutorials 
          : (data.tutorials || []);

      const mergedProblems = (prev.problems_to_solve && (prev.problems_to_solve.internal?.length > 0 || prev.problems_to_solve.external?.length > 0))
          ? prev.problems_to_solve
          : (data.problems_to_solve || { internal: [], external: [] });

      // 6. List Type
      // If prev has list_type, keep it.
      // Currently handled by `listType` state outside formData, but formData has it too?
      // formData doesn't have list_type in initial state, but might be added.
      // We'll respect `listType` state variable update logic in `useEffect`.

      return {
        ...prev,
        ...data, // This blindly overwrites everything, so we must override back with preserved
        ...mergedTopLevel,
        metadata: mergedMetadata,
        explanation: mergedExplanation,
        implementations: newImpls.length > 0 ? mergedImpls : prevImpls, // Only update if we have new impls
        tutorials: mergedTutorials,
        problems_to_solve: mergedProblems,
        // Explicitly handle list type if it was in data
        // note: setListType is separate state, we might need to update it too if we wanted to overwrite (but we don't)
      };
    });
    
    // Also update separate state if needed (but we are protecting it, so probably not)
    // if (data.list_type) setListType(data.list_type); 
    
    toast.success("Form updated (Protected fields preserved)");
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (

    <div className="space-y-0 w-full">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background pb-0 border-b">
        <div>
          <h2 className="text-2xl font-bold">
              <div className="mb-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/algorithms')}
            className="gap-2 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Algorithms
          </Button>
          {algorithm ? "Edit Algorithm" : "Create New Algorithm"} - {algorithm?.name}
      </div> 
          </h2>
        
        </div>
        <div className="flex items-center gap-2 pr-4">
             <SmartFillDialog 
                onFill={handleSmartFill} 
                initialTopic={formData.id || formData.title}
                existingApproaches={Array.from(new Set(
                  (formData.implementations || []).flatMap((impl: any) => 
                    (impl.code || []).map((c: any) => c.codeType)
                  )
                ))}
             />
        </div>

      </div>

      <div className="h-[calc(100vh-40px)]  ">
        <ResizablePanelGroup direction="horizontal" className="h-full border rounded-lg overflow-hidden">
          {/* Left Side - Form */}
          <ResizablePanel defaultSize={50} minSize={20} collapsible={true} className="min-w-0">
             <div className="h-full overflow-y-auto p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-7 h-auto mb-4">
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
                    <TabsTrigger value="tutorials" className="text-xs">
                      Tutorials
                    </TabsTrigger>
                    <TabsTrigger value="controls" className="text-xs">
                      Controls
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-4">
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
                          <Label>Serial No</Label>
                          <Input
                            type="number"
                            value={formData.serial_no}
                            onChange={(e) =>
                              setFormData({ ...formData, serial_no: e.target.value })
                            }
                            placeholder="e.g., 1"
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
                          <Label>List Type</Label>
                          <Select value={listType} onValueChange={setListType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select list type" />
                            </SelectTrigger>
                            <SelectContent>
                              {LIST_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
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

                  {/* Tutorials Tab */}
                  <TabsContent value="tutorials" className="mt-4">
                    <TutorialsEditor
                      tutorials={formData.tutorials}
                      onChange={(tutorials) => setFormData({ ...formData, tutorials })}
                    />
                  </TabsContent>

                  {/* Controls Tab */}
                  <TabsContent value="controls" className="mt-4">
                     <ControlsEditor
                      controls={formData.controls}
                      onChange={(controls) => setFormData({ ...formData, controls })}
                      implementations={formData.implementations}
                      onImplementationsChange={(implementations) => setFormData({ ...formData, implementations })}
                    />
                  </TabsContent>
                </Tabs>
             </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Side - Preview */}
          <ResizablePanel defaultSize={50} minSize={20} collapsible={true} className="min-w-0 bg-muted/5">
             <div className="h-full overflow-hidden p-2">
                 <AlgorithmPreview algorithm={formData} />
             </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
