import {
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  Palette,
  Maximize2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

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
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whiteboardRestore, setWhiteboardRestore] = useState<any>(null);
  const [noteRestore, setNoteRestore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(`brainstorm-tab-${algorithmId}`) || "whiteboard";
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`brainstorm-tab-${algorithmId}`, value);
  };

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
        <div className="flex items-center justify-between p-6">
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
          <div className="flex items-center gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Expand</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full w-full h-[75vh] p-0 gap-0">
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  className="w-full h-full flex flex-col"
                >
                  <TabsList className="w-full justify-start rounded-none border-b px-4 bg-background">
                    <TabsTrigger value="whiteboard" className="gap-2">
                      <Palette className="w-4 h-4" />
                      Whiteboard
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Notes
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                      <History className="w-4 h-4" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="whiteboard" className="h-full m-0">
                      <WhiteboardComponent
                        algorithmId={algorithmId}
                        algorithmTitle={algorithmTitle}
                        restoreData={whiteboardRestore}
                      />
                    </TabsContent>

                    <TabsContent value="notes" className="h-full m-0">
                      <NotesComponent
                        algorithmId={algorithmId}
                        algorithmTitle={algorithmTitle}
                        restoreData={noteRestore}
                      />
                    </TabsContent>

                    <TabsContent value="history" className="h-full m-0 p-4 overflow-auto">
                      <HistoryTab
                        algorithmId={algorithmId}
                        onRestoreWhiteboard={handleRestoreWhiteboard}
                        onRestoreNote={handleRestoreNote}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </DialogContent>
            </Dialog>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        {!isOpen && (
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-medium text-foreground">Sketch your ideas</span> — draw diagrams, take notes, and save your work for quick reference.
              </p>
            </div>
          </div>
        )}

        <CollapsibleContent>
          <div className="p-6 pt-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
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
                  algorithmTitle={algorithmTitle}
                  restoreData={whiteboardRestore}
                />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-0">
                <NotesComponent
                  algorithmId={algorithmId}
                  algorithmTitle={algorithmTitle}
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
