import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const DEFAULT_CONTROLS = {
  tabs: {
    visualization: true,
    description: true,
    solutions: true,
    brainstorm: true,
    history: true,
    code: true,
  },
  description: {
      problem_statement: true,
      overview: true,
      guides: true,
  },
  header: {
    random_problem: true,
    next_problem: true,
    interview_mode: true,
    timer: true,
    bug_report: true,
  },
  metadata: {
     difficulty: true,
     companies: true,
     attempted_badge: true,
  },
  social: {
     voting: true,
     favorite: true,
     share: true,
  },
  brainstorm: {
    notes: true,
    whiteboard: true,
  },
  content: {
    youtube_tutorial: true,
    practice_problems: true,
  },
  code_runner: {
    run_code: true,
    submit: true,
    add_test_case: true,
    languages: {
        typescript: true,
        python: true,
        java: true,
        cpp: true,
    }
  },
  solutions: {
      approaches: true,
      languages: {
        typescript: true,
        python: true,
        java: true,
        cpp: true,
      }
  }
};



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

interface ControlsEditorProps {
  controls: any;
  onChange: (controls: any) => void;
  implementations?: CodeImplementation[];
  onImplementationsChange?: (implementations: CodeImplementation[]) => void;
}

const ConfirmSwitch = ({ 
  id, 
  itemLabel, 
  checked, 
  onCheckedChange 
}: { 
  id: string;
  itemLabel: string; 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void; 
}) => {
  const [open, setOpen] = useState(false);
  const [pendingState, setPendingState] = useState(false);

  const handleSwitchClick = (e: React.MouseEvent) => {
    // If we are disabling a feature (currently checked -> going to unchecked), show confirmation
    if (checked) {
      e.preventDefault();
      setPendingState(false);
      setOpen(true);
    } else {
      // Enabling doesn't need confirmation
      onCheckedChange(true);
    }
  };

  const handleConfirm = () => {
    onCheckedChange(false);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{itemLabel}</Label>
      <div className="flex items-center">
        <Switch 
            id={id} 
            checked={checked} 
            onClick={handleSwitchClick}
            // We handle state change via click for confirmation interception
            // but we still need onCheckedChange available? 
            // Actually Switch onClick might trigger before onCheckedChange.
            // Let's rely on onClick preventDefault.
        />
        
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disable {itemLabel}?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disable this feature? Users will no longer see the <strong>{itemLabel}</strong> section on the algorithm page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Disable Feature
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

const VisibilityMatrix = ({ 
  implementations, 
  onUpdate 
}: { 
  implementations: CodeImplementation[];
  onUpdate: (impls: CodeImplementation[]) => void;
}) => {
  if (!implementations || implementations.length === 0) return null;

  // 1. Gather all unique approaches (code types)
  const codeTypes = new Set<string>();
  implementations.forEach(impl => {
      impl.code?.forEach(c => codeTypes.add(c.codeType));
  });
  const approaches = Array.from(codeTypes);

  // Toggle field globally for an approach (for all languages)
  const toggleGlobalField = (codeType: string, field: 'showExplanationBefore' | 'showExplanationAfter', currentVal: boolean) => {
    const newImpls = implementations.map(impl => ({
      ...impl,
      code: impl.code.map(c => 
        c.codeType === codeType ? { ...c, [field]: !currentVal } : c
      )
    }));
    onUpdate(newImpls);
  };

  // Toggle field for specific language (for code visibility)
  const toggleLocalField = (lang: string, codeType: string, currentVal: boolean) => {
      const newImpls = implementations.map(impl => {
          if (impl.lang !== lang) return impl;
          return {
              ...impl,
              code: impl.code.map(c => {
                  if (c.codeType !== codeType) return c;
                  return { ...c, isVisible: !currentVal };
              })
          };
      });
      onUpdate(newImpls);
  };

  // Derive languages dynamically from implementations
  const uniqueLangs = new Set<string>();
  implementations.forEach(impl => uniqueLangs.add(impl.lang));
  const LANGUAGES = Array.from(uniqueLangs).sort();

  return (
    <div className="mt-4 border rounded-md p-3 bg-muted/20">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
         Approach Visibility Control
         <span className="text-xs font-normal text-muted-foreground">(Explanations are shared, Code is per-language)</span>
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
           <thead>
              <tr className="border-b bg-muted/30">
                 <th className="text-left font-medium p-2 min-w-[150px] border-r">Approach</th>
                 <th className="text-center font-medium p-2 min-w-[80px] w-[80px]">Pre-Exp</th>
                 <th className="text-center font-medium p-2 min-w-[80px] w-[80px] border-r">Post-Exp</th>
                 {LANGUAGES.map(lang => (
                     <th key={lang} className="text-center font-medium p-2 capitalize min-w-[80px]">{lang}</th>
                 ))}
              </tr>
           </thead>
           <tbody>
              {approaches.map(approach => {
                  // Get first instance to check global status (since we sync them)
                  const firstImpl = implementations.find(i => i.code.some(c => c.codeType === approach));
                  const firstBlock = firstImpl?.code.find(c => c.codeType === approach);
                  
                  const isPreVisible = firstBlock?.showExplanationBefore !== false;
                  const isPostVisible = firstBlock?.showExplanationAfter !== false;

                  return (
                    <tr key={approach} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-2 font-medium capitalize border-r">
                            {approach.replace(/-/g, ' ')}
                        </td>
                        
                        {/* GLOBAL: Pre-Explanation */}
                        <td className="p-2 text-center">
                             <Switch 
                                checked={isPreVisible}
                                onCheckedChange={() => toggleGlobalField(approach, 'showExplanationBefore', isPreVisible)}
                                className="scale-75 data-[state=checked]:bg-blue-600"
                                title="Toggle All Pre-Explanations"
                            />
                        </td>

                        {/* GLOBAL: Post-Explanation */}
                        <td className="p-2 text-center border-r">
                             <Switch 
                                checked={isPostVisible}
                                onCheckedChange={() => toggleGlobalField(approach, 'showExplanationAfter', isPostVisible)}
                                className="scale-75 data-[state=checked]:bg-purple-600"
                                title="Toggle All Post-Explanations"
                            />
                        </td>

                        {/* LOCAL: Code Visibility per Language */}
                        {LANGUAGES.map(lang => {
                            const impl = implementations.find(i => i.lang === lang);
                            const block = impl?.code.find(c => c.codeType === approach);
                            
                            if (!impl || !block) {
                                return <td key={lang} className="p-2 text-center text-muted-foreground/30">-</td>;
                            }

                            const isCodeVisible = block.isVisible !== false;

                            return (
                                <td key={lang} className="p-2 text-center">
                                    <Switch 
                                        checked={isCodeVisible}
                                        onCheckedChange={() => toggleLocalField(lang, approach, isCodeVisible)}
                                        className="scale-75 data-[state=checked]:bg-green-600"
                                        title={`Toggle ${lang} Code`}
                                    />
                                </td>
                            );
                        })}
                    </tr>
                  );
              })}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export function ControlsEditor({ controls, onChange, implementations, onImplementationsChange }: ControlsEditorProps) {
  // Ensure we have all default keys if some are missing (backward compatibility)
  const localControls = { ...DEFAULT_CONTROLS, ...controls };

  const updateNested = (path: string[], value: boolean) => {
    const newControls = JSON.parse(JSON.stringify(localControls));
    let current = newControls;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]] || typeof current[path[i]] !== 'object') current[path[i]] = {};
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newControls);
  };

  const handleQuickAction = (action: 'enable_all' | 'disable_all') => {
      const val = action === 'enable_all';
      // Deep clone check
      const newControls = JSON.parse(JSON.stringify(DEFAULT_CONTROLS));
      
      // Helper to traverse and set
      const setAll = (obj: any) => {
          for (const key in obj) {
              if (key === 'maintenance_mode') {
                  obj[key] = false; // Always disable maintenance mode on reset
                  continue;
              }
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                  setAll(obj[key]);
              } else if (typeof obj[key] === 'boolean') {
                  obj[key] = val;
              }
          }
      };
      setAll(newControls);
      onChange(newControls);
  };

  return (
    <div className="space-y-6">
       {/* GLOBAL MAINTENANCE & QUICK ACTIONS */}
       <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-destructive flex items-center gap-2">
                Alert Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ConfirmSwitch 
              id="maint-mode"
              itemLabel="Maintenance Mode (Coming Soon Page)"
              checked={localControls.maintenance_mode === true}
              onCheckedChange={(c) => updateNested(['maintenance_mode'], c)}
            />
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('disable_all')}>Disable All Features</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAction('enable_all')}>Enable All Features</Button>
            </div>
          </CardContent>
        </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* TAB VISIBILITY */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Tab Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ConfirmSwitch 
              id="tab-vis"
              itemLabel="Visualization"
              checked={localControls.tabs?.visualization !== false}
              onCheckedChange={(c) => updateNested(['tabs', 'visualization'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="tab-desc"
              itemLabel="Description"
              checked={localControls.tabs?.description !== false}
              onCheckedChange={(c) => updateNested(['tabs', 'description'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="tab-sol"
              itemLabel="Solutions"
              checked={localControls.tabs?.solutions !== false}
              onCheckedChange={(c) => updateNested(['tabs', 'solutions'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="tab-brain"
              itemLabel="Brainstorm"
              checked={localControls.tabs?.brainstorm !== false}
              onCheckedChange={(c) => updateNested(['tabs', 'brainstorm'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="tab-code"
              itemLabel="Code"
              checked={localControls.tabs?.code !== false}
              onCheckedChange={(c) => updateNested(['tabs', 'code'], c)}
            />
          </CardContent>
        </Card>

        {/* DESCRIPTION GRANULAR */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Description Controls</CardTitle>
          </CardHeader>
           <CardContent className="space-y-3">
            <ConfirmSwitch 
              id="desc-prob"
              itemLabel="Problem Statement (Text Only)"
              checked={localControls.description?.problem_statement !== false}
              onCheckedChange={(c) => updateNested(['description', 'problem_statement'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="desc-const"
              itemLabel="Constraints"
              checked={localControls.description?.constraints !== false}
              onCheckedChange={(c) => updateNested(['description', 'constraints'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="desc-ex"
              itemLabel="Examples (IO)"
              checked={localControls.description?.examples !== false}
              onCheckedChange={(c) => updateNested(['description', 'examples'], c)}
            />
             <Separator />
             <ConfirmSwitch 
              id="desc-over"
              itemLabel="Algorithm Overview"
              checked={localControls.description?.overview !== false}
              onCheckedChange={(c) => updateNested(['description', 'overview'], c)}
            />
             <Separator />
             <ConfirmSwitch 
              id="desc-guides"
              itemLabel="Steps, Use Cases, Tips"
              checked={localControls.description?.guides !== false}
              onCheckedChange={(c) => updateNested(['description', 'guides'], c)}
            />
          </CardContent>
        </Card>

        {/* HEADER CONTROLS */}
        <Card>
          <CardHeader className="pb-3">
             <CardTitle className="text-base font-medium">Header Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="head-rand"
              itemLabel="Random Problem"
              checked={localControls.header?.random_problem !== false}
              onCheckedChange={(c) => updateNested(['header', 'random_problem'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="head-next"
              itemLabel="Next Problem"
              checked={localControls.header?.next_problem !== false}
              onCheckedChange={(c) => updateNested(['header', 'next_problem'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="head-int"
              itemLabel="Interview Mode"
              checked={localControls.header?.interview_mode !== false}
              onCheckedChange={(c) => updateNested(['header', 'interview_mode'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="head-timer"
              itemLabel="Timer"
              checked={localControls.header?.timer !== false}
              onCheckedChange={(c) => updateNested(['header', 'timer'], c)}
            />
             <Separator />
             <ConfirmSwitch 
              id="head-bug"
              itemLabel="Bug Report"
              checked={localControls.header?.bug_report !== false}
              onCheckedChange={(c) => updateNested(['header', 'bug_report'], c)}
            />
          </CardContent>
        </Card>

        {/* METADATA & SOCIAL */}
        <Card>
           <CardHeader className="pb-3">
             <CardTitle className="text-base font-medium">Metadata & Social</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="meta-diff"
              itemLabel="Difficulty Badge"
              checked={localControls.metadata?.difficulty !== false}
              onCheckedChange={(c) => updateNested(['metadata', 'difficulty'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="meta-comp"
              itemLabel="Company Tags"
              checked={localControls.metadata?.companies !== false}
              onCheckedChange={(c) => updateNested(['metadata', 'companies'], c)}
            />
             <Separator />
             <ConfirmSwitch 
              id="meta-att"
              itemLabel="Attempted Badge"
              checked={localControls.metadata?.attempted_badge !== false}
              onCheckedChange={(c) => updateNested(['metadata', 'attempted_badge'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="soc-vote"
              itemLabel="Voting (Like/Dislike)"
              checked={localControls.social?.voting !== false}
              onCheckedChange={(c) => updateNested(['social', 'voting'], c)}
            />
             <Separator />
             <ConfirmSwitch 
              id="soc-fav"
              itemLabel="Favorite Button"
              checked={localControls.social?.favorite !== false}
              onCheckedChange={(c) => updateNested(['social', 'favorite'], c)}
            />
              <Separator />
             <ConfirmSwitch 
              id="soc-share"
              itemLabel="Share Button"
              checked={localControls.social?.share !== false}
              onCheckedChange={(c) => updateNested(['social', 'share'], c)}
            />
          </CardContent>
        </Card>

        {/* CONTENT SECTIONS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Content Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="con-yt"
              itemLabel="YouTube Tutorial"
              checked={localControls.content?.youtube_tutorial !== false}
              onCheckedChange={(c) => updateNested(['content', 'youtube_tutorial'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="con-prac"
              itemLabel="Practice Problems"
              checked={localControls.content?.practice_problems !== false}
              onCheckedChange={(c) => updateNested(['content', 'practice_problems'], c)}
            />
          </CardContent>
        </Card>
        
        {/* BRAINSTORM TOOLS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Brainstorm Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="br-notes"
              itemLabel="Notes"
              checked={localControls.brainstorm?.notes !== false}
              onCheckedChange={(c) => updateNested(['brainstorm', 'notes'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="br-white"
              itemLabel="Whiteboard"
              checked={localControls.brainstorm?.whiteboard !== false}
              onCheckedChange={(c) => updateNested(['brainstorm', 'whiteboard'], c)}
            />
          </CardContent>
        </Card>

        {/* CODE RUNNER CONFIG */}
        <Card>
          <CardHeader className="pb-3">
             <CardTitle className="text-base font-medium">Code Runner Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
               id="cr-run"
               itemLabel="Run Code Button"
               checked={localControls.code_runner?.run_code !== false}
               onCheckedChange={(c) => updateNested(['code_runner', 'run_code'], c)}
             />
              <Separator />
             <ConfirmSwitch 
               id="cr-sub"
               itemLabel="Submit Button"
               checked={localControls.code_runner?.submit !== false}
               onCheckedChange={(c) => updateNested(['code_runner', 'submit'], c)}
             />
              <Separator />
             <ConfirmSwitch 
               id="cr-add"
               itemLabel="Add Test Case"
               checked={localControls.code_runner?.add_test_case !== false}
               onCheckedChange={(c) => updateNested(['code_runner', 'add_test_case'], c)}
             />
             <Separator className="my-2" />
             <h4 className="text-sm font-semibold mb-2">Languages (Run Ability)</h4>
             <div className="grid grid-cols-2 gap-2">
                 {['typescript', 'python', 'java', 'cpp'].map(lang => (
                     <ConfirmSwitch 
                       key={lang}
                       id={`cr-lang-${lang}`}
                       itemLabel={lang.charAt(0).toUpperCase() + lang.slice(1)}
                       checked={localControls.code_runner?.languages?.[lang] !== false}
                       onCheckedChange={(c) => updateNested(['code_runner', 'languages', lang], c)}
                     />
                 ))}
             </div>
          </CardContent>
        </Card>

        {/* SOLUTIONS CONFIG */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Solutions Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="sol-app"
              itemLabel="Approaches (Show All vs Optimal Only)"
              checked={localControls.solutions?.approaches !== false}
              onCheckedChange={(c) => updateNested(['solutions', 'approaches'], c)}
            />
            <Separator />
             <ConfirmSwitch 
              id="sol-exp-bef"
              itemLabel="Explanation Before Code"
              checked={localControls.solutions?.explanation_before !== false}
              onCheckedChange={(c) => updateNested(['solutions', 'explanation_before'], c)}
            />
             <ConfirmSwitch 
              id="sol-exp-aft"
              itemLabel="Explanation After Code"
              checked={localControls.solutions?.explanation_after !== false}
              onCheckedChange={(c) => updateNested(['solutions', 'explanation_after'], c)}
            />
            <Separator className="my-2" />
            <h4 className="text-sm font-semibold mb-2">Languages (Visibility)</h4>
             <div className="grid grid-cols-2 gap-2">
                 {['typescript', 'python', 'java', 'cpp'].map(lang => (
                     <ConfirmSwitch 
                       key={lang}
                       id={`sol-lang-${lang}`}
                       itemLabel={lang.charAt(0).toUpperCase() + lang.slice(1)}
                       checked={localControls.solutions?.languages?.[lang] !== false}
                       onCheckedChange={(c) => updateNested(['solutions', 'languages', lang], c)}
                     />
                 ))}
             </div>
             
             {/* Granular Visibility Matrix */}
             {implementations && onImplementationsChange && (
                <>
                    <Separator className="my-2" />
                    <VisibilityMatrix 
                        implementations={implementations}
                        onUpdate={onImplementationsChange}
                    />
                </>
             )}
          </CardContent>
        </Card>
      </div>

      {/* CODE RUNNER CONFIG */}

    </div>
  );
}
