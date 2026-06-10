import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateAlgorithm,
  useUpdateAlgorithm,
} from "@/hooks/useAlgorithms";
import { Algorithm } from "@/types/algorithm";
import { ListType, LIST_TYPE_LABELS } from "@/types/algorithm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_CATEGORIES } from "@/constants/categories";
import { Badge } from "@/components/ui/badge";

import dynamic from "next/dynamic";

// Import all editor components dynamically
const ExplanationEditor = dynamic(() => import("./ExplanationEditor").then(mod => mod.ExplanationEditor), { ssr: false });
const CodeImplementationEditor = dynamic(() => import("./CodeImplementationEditor").then(mod => mod.CodeImplementationEditor), { ssr: false });
const TestCaseEditor = dynamic(() => import("./TestCaseEditor").then(mod => mod.TestCaseEditor), { ssr: false });
const InputSchemaEditor = dynamic(() => import("./InputSchemaEditor").then(mod => mod.InputSchemaEditor), { ssr: false });
const MetadataEditor = dynamic(() => import("./MetadataEditor").then(mod => mod.MetadataEditor), { ssr: false });
const ProblemsEditor = dynamic(() => import("./ProblemsEditor").then(mod => mod.ProblemsEditor), { ssr: false });
const AlgorithmPreview = dynamic(() => import("@/components/AlgorithmPreview").then(mod => mod.AlgorithmPreview), { ssr: false });
const TutorialsEditor = dynamic(() => import("./TutorialsEditor").then(mod => mod.TutorialsEditor), { ssr: false });
const ControlsEditor = dynamic(() => import("./ControlsEditor").then(mod => mod.ControlsEditor), { ssr: false });
// Special handling for named export and the constant
import { DEFAULT_CONTROLS } from "./ControlsEditor";

const SmartFillDialog = dynamic(() => import("./SmartFillDialog").then(mod => mod.SmartFillDialog), { ssr: false });
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

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
  const [listTypes, setListTypes] = useState<string[]>(["core"]);
  const [categories, setCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [published, setPublished] = useState(true);
  const router = useRouter();

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
      class_mode: false,
      class_name: "",
    },
    problems_to_solve: {
      internal: [],
      external: [],
    },
    tutorials: [],
    controls: DEFAULT_CONTROLS,
  });

  const allAlgorithms = useAppSelector((state) => state.algorithms.items);

  const currentId = algorithm?.id;
  const currentIndex = allAlgorithms.findIndex((algo) => algo.id === currentId);
  const prevAlgo = currentIndex > 0 ? allAlgorithms[currentIndex - 1] : null;
  const nextAlgo = currentIndex !== -1 && currentIndex < allAlgorithms.length - 1 ? allAlgorithms[currentIndex + 1] : null;

  const [isDirty, setIsDirty] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Track if form becomes dirty after initial load
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      setIsDirty(false);
    } else {
      setIsDirty(true);
    }
  }, [formData, listTypes, categories, published]);

  const handlePrevProblem = () => {
    if (prevAlgo) {
      if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to navigate?")) {
        return;
      }
      router.push(`/admin/problem/${prevAlgo.id}`);
    }
  };

  const handleNextProblem = () => {
    if (nextAlgo) {
      if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to navigate?")) {
        return;
      }
      router.push(`/admin/problem/${nextAlgo.id}`);
    }
  };

  // Load algorithm data when editing
  useEffect(() => {
    if (algorithm) {
      const metadataObj =
        typeof algorithm.metadata === "string"
          ? JSON.parse(algorithm.metadata)
          : algorithm.metadata;

      let initialListTypes = algorithm.listTypes || algorithm.list_types;
      if (!initialListTypes && algorithm.list_type) {
        initialListTypes = [algorithm.list_type];
      }
      if (!initialListTypes || initialListTypes.length === 0) {
        const metaListType = metadataObj?.listType || metadataObj?.list_types;
        if (metaListType) {
          initialListTypes = Array.isArray(metaListType) ? metaListType : [metaListType];
        }
      }
      if (!initialListTypes || initialListTypes.length === 0) {
        initialListTypes = ["core"];
      }
      // sanitize
      initialListTypes = initialListTypes.map((t: string) => t === "coreAlgo" ? "core" : t);
      
      setListTypes(initialListTypes);
      
      let initialCategories = algorithm.categories;
      if (!initialCategories && algorithm.category) {
        initialCategories = algorithm.category.split(',').map((c: string) => c.trim()).filter(Boolean);
      }
      if (!initialCategories) {
        initialCategories = [];
      }
      setCategories(initialCategories);

      setPublished(algorithm.published !== false);

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
    } else {
      setListTypes(["core"]);
      setPublished(false); // default to false (draft) for new algorithms
    }
    
    // Allow state to settle before tracking dirty again
    isInitialLoadRef.current = true;
    setIsDirty(false);
  }, [algorithm]);

  const handleSave = async () => {
    // Validation
    if (!formData.id || !formData.name || !formData.title) {
      toast.error("Please fill in all required fields (ID, Name, Title)");
      return;
    }

    if (categories.length === 0) {
      toast.error("At least one category is required");
      return;
    }

    const payload = {
      ...formData,
      categories: categories,
      category: categories.join(', '),
      list_type: listTypes[0] || "core",
      list_types: listTypes,
      published: published,
      serial_no: formData.serial_no ? parseInt(formData.serial_no) : null,
      metadata: {
        ...formData.metadata,
        listType: listTypes[0] || "core",
        listTypes: listTypes,
      },
    };

    try {
      if (algorithm) {
        await updateMutation.mutateAsync({
          id: algorithm.id,
          updates: payload,
        });
        toast.success("Algorithm updated successfully!");
        setIsDirty(false);
        // Don't navigate away, stay on the page
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Algorithm created successfully!");
        setIsDirty(false);
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
        is_pro: prevMeta.is_pro !== undefined ? prevMeta.is_pro : (newMeta.is_pro || false),
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
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-">
            <div className="mb-1 flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to navigate?")) {
                    return;
                  }
                  router.push('/admin/problems');
                }}
                className="gap-2 pl-0 hover:pl-2 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Problems
              </Button>
              <span>
                {algorithm ? "Edit Problem" : "Create New Problem"} - {algorithm?.name}
              </span>
            </div>
          </h2>
          {algorithm && (
            <div className="flex items-center gap-1.5 border rounded-full px-2 py-0.5 bg-muted/40 h-8 self-center mb-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePrevProblem}
                disabled={!prevAlgo}
                className="h-6 w-6 rounded-full p-0 hover:bg-background/80"
                title={prevAlgo ? `Previous: ${prevAlgo.title}` : "No previous problem"}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-semibold px-1 select-none">
                {algorithm.serial_no ? `#${algorithm.serial_no}` : "-"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleNextProblem}
                disabled={!nextAlgo}
                className="h-6 w-6 rounded-full p-0 hover:bg-background/80"
                title={nextAlgo ? `Next: ${nextAlgo.title}` : "No next problem"}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
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

                      <div className="space-y-2 flex flex-col">
                        <Label>Categories *</Label>
                        <div className="flex flex-wrap gap-2 min-h-[38px] p-2 border rounded-md bg-background">
                          {categories.length === 0 ? (
                            <span className="text-sm text-muted-foreground">No categories selected</span>
                          ) : (
                            categories.map((cat: string) => (
                              <Badge key={cat} variant="secondary" className="capitalize flex items-center gap-1">
                                {cat}
                                <X className="w-3.5 h-3.5 opacity-60 hover:opacity-100 cursor-pointer" onClick={() => {
                                  setCategories(prev => prev.filter(c => c !== cat));
                                }} />
                              </Badge>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Select
                            value=""
                            onValueChange={(val) => {
                              if (val && !categories.includes(val)) {
                                setCategories(prev => [...prev, val]);
                              }
                            }}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Add category..." />
                            </SelectTrigger>
                            <SelectContent>
                              {ADMIN_CATEGORIES.filter(c => !categories.includes(c)).map(cat => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="flex gap-1 flex-1">
                            <Input
                              placeholder="Or type custom category..."
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (customCategory.trim() && !categories.includes(customCategory.trim())) {
                                    setCategories(prev => [...prev, customCategory.trim()]);
                                    setCustomCategory("");
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (customCategory.trim() && !categories.includes(customCategory.trim())) {
                                  setCategories(prev => [...prev, customCategory.trim()]);
                                  setCustomCategory("");
                                }
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
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
                        <Label className="block mb-2">List Types *</Label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {Object.entries(LIST_TYPE_LABELS)
                            .filter(([key]) => key !== 'all' && key !== 'coreAlgo')
                            .map(([value, label]) => {
                              const isSelected = listTypes.includes(value);
                              return (
                                <Button
                                  key={value}
                                  type="button"
                                  variant={isSelected ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 rounded-full transition-all"
                                  onClick={() => {
                                    if (isSelected) {
                                      setListTypes(listTypes.filter((t) => t !== value));
                                    } else {
                                      setListTypes([...listTypes, value]);
                                    }
                                  }}
                                >
                                  {label}
                                </Button>
                              );
                            })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-4">
                        <Switch
                          id="published-toggle"
                          checked={published}
                          onCheckedChange={setPublished}
                        />
                        <Label htmlFor="published-toggle" className="font-semibold cursor-pointer">Published (Visible to Users)</Label>
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
                    algorithmName={formData.name || formData.title}
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

                  <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/30">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="unordered-toggle" className="font-semibold">Unordered Comparison</Label>
                        <Switch
                          id="unordered-toggle"
                          checked={formData.metadata?.unordered || false}
                          onCheckedChange={(val) => setFormData({
                            ...formData,
                            metadata: { ...formData.metadata, unordered: val }
                          })}
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
                          checked={formData.metadata?.multi_expected || false}
                          onCheckedChange={(val) => setFormData({
                            ...formData,
                            metadata: { ...formData.metadata, multi_expected: val }
                          })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        If enabled, "expectedOutput" should be an array of valid results. Code passes if actual matches ANY variant.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-orange-500/5 border-orange-500/20">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="class-mode-toggle" className="text-lg font-semibold text-orange-800 dark:text-orange-300">
                            Class-Based Execution (Multi-Function)
                          </Label>
                          <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
                            Enable this for problems like LRU Cache that require a sequence of method calls on a class instance.
                          </p>
                        </div>
                        <Switch
                          id="class-mode-toggle"
                          checked={formData.metadata?.class_mode || false}
                          onCheckedChange={(val) => setFormData({
                            ...formData,
                            metadata: { ...formData.metadata, class_mode: val }
                          })}
                          className="data-[state=checked]:bg-orange-500"
                        />
                      </div>

                      {formData.metadata?.class_mode && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                          <Label htmlFor="class-name-input">Class Name (Optional)</Label>
                          <Input
                            id="class-name-input"
                            value={formData.metadata?.class_name || ""}
                            onChange={(e) => setFormData({
                              ...formData,
                              metadata: { ...formData.metadata, class_name: e.target.value }
                            })}
                            placeholder="e.g., LRUCache (auto-detected if empty)"
                            className="bg-background"
                          />
                          <p className="text-xs text-muted-foreground">
                            The name of the class to instantiate. If left blank, it will be auto-detected from the first element of the test case method array.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

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
          onClick={() => {
            if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to navigate?")) {
              return;
            }
            onCancel();
          }}
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
