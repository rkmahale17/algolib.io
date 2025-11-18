import {
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  Palette,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HistoryTab } from "./HistoryTab";
import { NotesComponent } from "./NotesComponent";
import { WhiteboardComponent } from "./WhiteboardComponent";
import { useState } from "react";

interface BrainstormSectionProps {
  algorithmId: string;
  algorithmTitle: string;
}

export const BrainstormSection = ({
  algorithmId,
  algorithmTitle,
}: BrainstormSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [whiteboardRestore, setWhiteboardRestore] = useState<any>(null);
  const [noteRestore, setNoteRestore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("whiteboard");

  const handleRestoreWhiteboard = (boardData: any) => {
    setWhiteboardRestore(boardData);
    setActiveTab("whiteboard");
    setIsOpen(true);
  };

  const handleRestoreNote = (noteData: any) => {
    setNoteRestore(noteData);
    setActiveTab("notes");
    setIsOpen(true);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-8">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full p-6 h-auto flex items-center justify-between hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold">Brainstorm Space</h2>
                <p className="text-sm text-muted-foreground">
                  Draw diagrams, take notes, and save your work for{" "}
                  <span className="font-semibold text-foreground">
                    {algorithmTitle}
                  </span>
                </p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </CollapsibleTrigger>
        {!isOpen && (
          <section className="max-w-xl mx-auto p-4">
            <article className="bg-white/60 backdrop-blur-sm ring-1 ring-gray-200 rounded-2xl shadow-lg p-6 space-y-4">
              <header className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-gradient-to-tr from-indigo-500 to-sky-400 p-3 rounded-xl">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18h6"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M10 22h4"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 2a6 6 0 00-4 10.5V15a2 2 0 002 2h4a2 2 0 002-2v-2.5A6 6 0 0012 2z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    First, think for yourself
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    A short workflow to turn ideas into a reproducible algorithm
                    sketch.
                  </p>
                </div>
              </header>

              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      Sketch the problem statement
                    </p>
                    <p className="text-xs text-gray-500">
                      Draw what the problem describes — shapes, inputs, outputs,
                      and constraints.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      Explore practical use-cases
                    </p>
                    <p className="text-xs text-gray-500">
                      Think of real scenarios where this algorithm applies or
                      could be adapted.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      Write pseudocode
                    </p>
                    <p className="text-xs text-gray-500">
                      Keep it concise — focus on the core steps and data
                      transformations.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <span className="mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-100 text-sky-700 text-sm font-medium">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      Save drawings and notes
                    </p>
                    <p className="text-xs text-gray-500">
                      Store your sketches and notes for future quick reference
                      and revision.
                    </p>
                  </div>
                </li>
              </ul>

              <footer className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Tip: Keep sketches simple — clarity beats detail for first
                  drafts.
                </div>
                <div className="flex gap-2">
                  <CollapsibleTrigger asChild>
                    <button className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                      Draw and Notes
                    </button>
                  </CollapsibleTrigger>
                </div>
              </footer>
            </article>
          </section>
        )}

        <CollapsibleContent>
          <div className="p-6 pt-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger
                  value="whiteboard"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Palette className="w-4 h-4" />
                  Whiteboard
                </TabsTrigger>
                <TabsTrigger
                  value="notes"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileText className="w-4 h-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whiteboard" className="space-y-4 mt-0">
                <WhiteboardComponent
                  algorithmId={algorithmId}
                  restoreData={whiteboardRestore}
                />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-0">
                <NotesComponent
                  algorithmId={algorithmId}
                  restoreData={noteRestore}
                />
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-0">
                <HistoryTab
                  algorithmId={algorithmId}
                  onRestoreWhiteboard={handleRestoreWhiteboard}
                  onRestoreNote={handleRestoreNote}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
