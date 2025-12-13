import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Text, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CodeBlock {
  codeType: string;
  code: string;
  explanationBefore?: string;
  explanationAfter?: string;
  isVisible?: boolean;
  showExplanationBefore?: boolean;
  showExplanationAfter?: boolean;
}

interface CodeImplementation {
  lang: string;
  code: CodeBlock[];
}

interface CodeImplementationEditorProps {
  implementations: CodeImplementation[];
  onChange: (implementations: CodeImplementation[]) => void;
}

const LANGUAGES = [
  { id: "typeScript", label: "TypeScript", monacoLang: "typescript" },
  { id: "python", label: "Python", monacoLang: "python" },
  { id: "java", label: "Java", monacoLang: "java" },
  { id: "cpp", label: "C++", monacoLang: "cpp" },
];

export function CodeImplementationEditor({
  implementations,
  onChange,
}: CodeImplementationEditorProps) {
  const [activeLanguage, setActiveLanguage] = useState(
    implementations[0]?.lang || "typeScript"
  );
  // Default to optimize if available, else first one, or "optimize" as fallback
  const currentImpl = implementations.find((impl) => impl.lang === activeLanguage);
  
  const [activeCodeType, setActiveCodeType] = useState<string>("optimize");
  const [newApproachName, setNewApproachName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Deletion confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'language' | 'approach';
    id: string; // langId or codeType
  }>({
    isOpen: false,
    type: 'language',
    id: ''
  });

  // Sync activeCodeType when language changes or if current type doesn't exist
  useEffect(() => {
    if (currentImpl && currentImpl.code.length > 0) {
      if (!currentImpl.code.find(c => c.codeType === activeCodeType)) {
        setActiveCodeType(currentImpl.code[0].codeType);
      }
    }
  }, [activeLanguage, currentImpl, activeCodeType]);

  const currentCode = currentImpl?.code.find(
    (c) => c.codeType === activeCodeType
  );

  const addLanguage = (langId: string) => {
    if (!implementations.find((impl) => impl.lang === langId)) {
      // Logic: If there are already implementations, we should respect the existing approaches
      // Get all unique code types currently being used
      const existingApproaches = new Set<string>();
      implementations.forEach(impl => {
        impl.code.forEach(c => existingApproaches.add(c.codeType));
      });
      
      let initialCodeBlocks: CodeBlock[] = [];
      
      if (existingApproaches.size > 0) {
        // Create a block for each existing approach
        initialCodeBlocks = Array.from(existingApproaches).map(type => ({
          codeType: type,
          code: "",
          explanationBefore: "",
          explanationAfter: ""
        }));
      } else {
        // Fallback default
        initialCodeBlocks = [
          { codeType: "optimize", code: "", explanationBefore: "", explanationAfter: "" },
          { codeType: "starter", code: "", explanationBefore: "", explanationAfter: "" },
        ];
      }

      onChange([
        ...implementations,
        {
          lang: langId,
          code: initialCodeBlocks,
        },
      ]);
      setActiveLanguage(langId);
    }
  };

  const confirmRemoveLanguage = (langId: string) => {
    setDeleteConfirm({
        isOpen: true,
        type: 'language',
        id: langId
    });
  };

  const confirmRemoveApproach = (codeType: string) => {
    setDeleteConfirm({
        isOpen: true,
        type: 'approach',
        id: codeType
    });
  };

  const proceedWithDelete = () => {
    const { type, id } = deleteConfirm;
    
    if (type === 'language') {
        const langId = id;
        onChange(implementations.filter((impl) => impl.lang !== langId));
        if (activeLanguage === langId) {
          setActiveLanguage(implementations[0]?.lang || "typeScript");
        }
    } else if (type === 'approach') {
        const codeType = id;
        // DELETE FROM ALL LANGUAGES
        const updatedImpls = implementations.map(impl => ({
            ...impl,
            code: impl.code.filter(c => c.codeType !== codeType)
        }));
        
        onChange(updatedImpls);
        
        // Switch active tab if we deleted the current one
        if (activeCodeType === codeType) {
            // Find a remaining codeType if possible from the active language
            const activeImpl = updatedImpls.find(i => i.lang === activeLanguage);
            if (activeImpl && activeImpl.code.length > 0) {
                setActiveCodeType(activeImpl.code[0].codeType);
            }
        }
    }
    
    setDeleteConfirm({ isOpen: false, type: 'language', id: '' });
  };

  const handleCreateApproach = () => {
    if (!newApproachName.trim()) return;
    
    // Normalize key
    const newTypeKey = newApproachName.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Check if exists in active implementation
    if (currentImpl && currentImpl.code.find(c => c.codeType === newTypeKey)) {
        return;
    }

    // SYNC: Create this approach for ALL existing languages
    const updatedImpls = implementations.map(impl => {
        // Check if this specific impl already has it (unlikely if we sync correctly, but good for safety)
        if (impl.code.find(c => c.codeType === newTypeKey)) return impl;
        
        return {
            ...impl,
            code: [...impl.code, { 
                codeType: newTypeKey, 
                code: "", 
                explanationBefore: "", 
                explanationAfter: "" 
            }]
        };
    });

    onChange(updatedImpls);
    setActiveCodeType(newTypeKey);
    setNewApproachName("");
    setIsDialogOpen(false);
  };

  // Updates a field for the specific language implementation (e.g. code)
  const updateCodeField = (field: keyof CodeBlock, value: string) => {
    onChange(
      implementations.map((impl) => {
        if (impl.lang === activeLanguage) {
          return {
            ...impl,
            code: impl.code.map((c) =>
              c.codeType === activeCodeType ? { ...c, [field]: value } : c
            ),
          };
        }
        return impl;
      })
    );
  };

  // Updates a field for ALL languages for this codeType (e.g. explanations)
  const updateGlobalCodeField = (field: keyof CodeBlock, value: string) => {
    onChange(
      implementations.map((impl) => ({
        ...impl,
        code: impl.code.map((c) =>
          c.codeType === activeCodeType ? { ...c, [field]: value } : c
        ),
      }))
    );
  };

  const moveApproach = (index: number, direction: 'left' | 'right') => {
    if (!currentImpl) return;
    
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    
    // Boundary checks
    if (newIndex < 0 || newIndex >= currentImpl.code.length) return;

    // Get the codeType we are moving
    const movingCodeType = currentImpl.code[index].codeType;
    const swapTargetCodeType = currentImpl.code[newIndex].codeType;

    // We need to reorder this key in ALL implementations to keep them in sync
    const updatedImpls = implementations.map(impl => {
        const newCode = [...impl.code];
        
        // Find indices in this specific implementation (should match, but safe to find)
        const idx1 = newCode.findIndex(c => c.codeType === movingCodeType);
        const idx2 = newCode.findIndex(c => c.codeType === swapTargetCodeType);
        
        if (idx1 !== -1 && idx2 !== -1) {
            // Swap
            [newCode[idx1], newCode[idx2]] = [newCode[idx2], newCode[idx1]];
        }
        
        return {
            ...impl,
            code: newCode
        };
    });

    onChange(updatedImpls);
  };

  const availableLanguages = LANGUAGES.filter(
    (lang) => !implementations.find((impl) => impl.lang === lang.id)
  );

  const getMonacoLanguage = (langId: string) => {
    return LANGUAGES.find((l) => l.id === langId)?.monacoLang || "typescript";
  };

  return (
    <div className="space-y-4">
      {/* Alert Dialog for Deletion */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm.type === 'language' 
                ? "This will delete all code and content for this language. This action cannot be undone."
                : "This will remove this approach from ALL languages. All code associated with this approach will be lost."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteConfirm.type === 'language' ? "Delete Language" : "Delete Approach"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Combined Editor Card */}
      <Card className="border-2">
        <CardHeader className="pb-3 space-y-4">
            {/* Approach Selection Row (Top) */}
            {currentImpl && (
             <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2 overflow-x-auto max-w-[80%] pb-2">
                    {currentImpl.code.map((block, index) => (
                        <div 
                           key={block.codeType}
                           onClick={() => setActiveCodeType(block.codeType)}
                           className={`
                             pl-3 pr-2 py-1.5 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-1 transition-colors whitespace-nowrap border
                             ${activeCodeType === block.codeType 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-background hover:bg-muted text-foreground border-border'}
                           `}
                        >
                            {/* Reorder Buttons */}
                            <div className="flex flex-col -ml-1 mr-1">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveApproach(index, 'left');
                                    }}
                                    disabled={index === 0}
                                    className={`
                                        p-0.5 hover:bg-white/20 rounded 
                                        ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}
                                    `}
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                </button>
                            </div>

                            <span className="capitalize select-none">{block.codeType.replace(/-/g, ' ')}</span>
                            
                            <div className="flex items-center gap-1 ml-1">
                                 {/* Only show delete if there's more than one approach OR if user wants to delete the last one */}
                                {currentImpl.code.length > 0 && (
                                    <button
                                        type="button"
                                        className={`p-1 hover:bg-white/20 rounded transition-colors ${activeCodeType === block.codeType ? 'text-primary-foreground/80 hover:text-primary-foreground' : 'text-muted-foreground hover:text-destructive'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmRemoveApproach(block.codeType);
                                        }}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveApproach(index, 'right');
                                    }}
                                    disabled={index === currentImpl.code.length - 1}
                                    className={`
                                        p-0.5 hover:bg-white/20 rounded 
                                        ${index === currentImpl.code.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}
                                    `}
                                >
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full border border-dashed">
                            <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Approach</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={newApproachName}
                              onChange={(e) => setNewApproachName(e.target.value)}
                              placeholder="e.g. Brute Force"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreateApproach}>Add Approach</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                </div>
             </div>
             )}

            {/* Language Selection Row (Below) */}
            <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Languages</span>
                    <div className="flex gap-2 flex-wrap">
                        {implementations.map((impl) => {
                        const lang = LANGUAGES.find((l) => l.id === impl.lang);
                        return (
                            <Badge
                            key={impl.lang}
                            variant={activeLanguage === impl.lang ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1.5 gap-2 text-sm"
                            onClick={() => setActiveLanguage(impl.lang)}
                            >
                            {lang?.label || impl.lang}
                            {implementations.length > 1 && (
                                <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    confirmRemoveLanguage(impl.lang);
                                }}
                                className="ml-1 hover:text-destructive"
                                >
                                <Trash2 className="h-3 w-3" />
                                </button>
                            )}
                            </Badge>
                        );
                        })}
                        
                        {/* Add Language Dropdown/Buttons */}
                        {availableLanguages.length > 0 && (
                             <div className="flex gap-2 ml-2 border-l pl-4">
                                {availableLanguages.map((lang) => (
                                    <Button
                                        key={lang.id}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addLanguage(lang.id)}
                                        className="gap-1 h-7 text-xs"
                                    >
                                        <Plus className="h-3 w-3" />
                                        {lang.label}
                                    </Button>
                                ))}
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </CardHeader>

        {currentImpl && (
          <CardContent className="space-y-6">
            
            {/* Code Editor */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                   Implementation ({getMonacoLanguage(activeLanguage)})
                </Label>
                <div className="border rounded-md overflow-hidden">
                <Editor
                    height="400px"
                    language={getMonacoLanguage(activeLanguage)}
                    value={currentCode?.code || ""}
                    onChange={(value) => updateCodeField('code', value || "")}
                    theme="vs-dark"
                    options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    automaticLayout: true,
                    }}
                />
                </div>
            </div>

            {/* Explanation Before */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Text className="w-3 h-3" /> Explanation Before Code (Shared across languages)
                </Label>
                <Textarea 
                    placeholder="Context or theory to show before the code block..."
                    className="min-h-[80px] font-sans"
                    value={currentCode?.explanationBefore || ""}
                    onChange={(e) => updateGlobalCodeField('explanationBefore', e.target.value)}
                />
            </div>

            {/* Explanation After */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Text className="w-3 h-3" /> Explanation After Code (Shared across languages)
                </Label>
                <Textarea 
                    placeholder="Complexity analysis or notes to show after the code block..."
                    className="min-h-[80px] font-sans"
                    value={currentCode?.explanationAfter || ""}
                    onChange={(e) => updateGlobalCodeField('explanationAfter', e.target.value)}
                />
            </div>

          </CardContent>
        )}

      {implementations.length === 0 && (
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No languages added yet</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {LANGUAGES.map((lang) => (
                <Button
                  key={lang.id}
                  type="button"
                  variant="outline"
                  onClick={() => addLanguage(lang.id)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add {lang.label}
                </Button>
              ))}
            </div>
          </CardContent>
      )}
      </Card>
    </div>
  );
}
