import { useState, useEffect } from "react";
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
      languages: true
  }
};

interface ControlsEditorProps {
  controls: any;
  onChange: (controls: any) => void;
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

export function ControlsEditor({ controls, onChange }: ControlsEditorProps) {
  // Ensure we have all default keys if some are missing (backward compatibility)
  const localControls = { ...DEFAULT_CONTROLS, ...controls };

  const updateNested = (path: string[], value: boolean) => {
    const newControls = JSON.parse(JSON.stringify(localControls));
    let current = newControls;
    for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newControls);
  };

  return (
    <div className="space-y-6">
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

        {/* SOLUTIONS CONFIG */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Solutions Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <ConfirmSwitch 
              id="sol-app"
              itemLabel="Approaches (Tabs)"
              checked={localControls.solutions?.approaches !== false}
              onCheckedChange={(c) => updateNested(['solutions', 'approaches'], c)}
            />
            <Separator />
            <ConfirmSwitch 
              id="sol-lang"
              itemLabel="Language Selector"
              checked={localControls.solutions?.languages !== false}
              onCheckedChange={(c) => updateNested(['solutions', 'languages'], c)}
            />
          </CardContent>
        </Card>
      </div>

      {/* CODE RUNNER CONFIG */}
      <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Code Runner Config</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Main Controls - Using ConfirmSwitch */}
                 <ConfirmSwitch 
                    id="cr-run" 
                    itemLabel="Run Button"
                    checked={localControls.code_runner?.run_code !== false}
                    onCheckedChange={(c) => updateNested(['code_runner', 'run_code'], c)}
                  />
                  
                 <ConfirmSwitch 
                    id="cr-sub" 
                    itemLabel="Submit Button"
                    checked={localControls.code_runner?.submit !== false}
                    onCheckedChange={(c) => updateNested(['code_runner', 'submit'], c)}
                  />

                 <ConfirmSwitch 
                    id="cr-add" 
                    itemLabel="Add Test Case"
                    checked={localControls.code_runner?.add_test_case !== false}
                    onCheckedChange={(c) => updateNested(['code_runner', 'add_test_case'], c)}
                  />
             </div>
             
             <Separator className="my-4" />
             
             <div className="space-y-3">
                <Label className="text-base font-medium block">Enabled Languages</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['typescript', 'python', 'java', 'cpp'].map((lang) => (
                        <ConfirmSwitch 
                            key={lang}
                            id={`lang-${lang}`}
                            itemLabel={lang.charAt(0).toUpperCase() + lang.slice(1)}
                            checked={localControls.code_runner?.languages?.[lang] !== false}
                            onCheckedChange={(c) => updateNested(['code_runner', 'languages', lang], c)}
                        />
                    ))}
                </div>
             </div>
          </CardContent>
        </Card>
    </div>
  );
}
