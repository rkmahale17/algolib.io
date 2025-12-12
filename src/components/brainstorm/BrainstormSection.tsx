import {
  Maximize2,
  Palette,
  FileText,
  History,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { HistoryTab } from "./HistoryTab";
import { NotesComponent } from "./NotesComponent";
import { LazyWhiteboardComponent } from "./LazyWhiteboardComponent";
import { useState, useRef, useEffect } from "react";
import { FeatureGuard } from "@/components/FeatureGuard";

interface BrainstormSectionProps {
  algorithmId: string;
  algorithmTitle: string;
  controls?: {
    notes: boolean;
    whiteboard: boolean;
    history: boolean;
  };
}

export const BrainstormSection = ({
  algorithmId,
  algorithmTitle,
  controls,
}: BrainstormSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [whiteboardRestore, setWhiteboardRestore] = useState<any>(null);
  const [noteRestore, setNoteRestore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(() => {
    return (
      localStorage.getItem(`brainstorm-tab-${algorithmId}`) || "whiteboard"
    );
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.width < 400);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`brainstorm-tab-${algorithmId}`, value);
  };

  const handleRestoreWhiteboard = (boardData: any) => {
    setWhiteboardRestore(boardData);
    setActiveTab("whiteboard");
  };

  const handleRestoreNote = (noteData: any) => {
    setNoteRestore(noteData);
    setActiveTab("notes");
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="h-full flex flex-col"
      >
        <div className="flex items-center justify-between border-b bg-muted/10 shrink-0">
          <TabsList className="flex-1 flex p-0 bg-transparent gap-0 rounded-none h-12">
            <TooltipProvider>
              <FeatureGuard flag="drawing">
                {controls?.whiteboard !== false && (
                  <TabsTrigger
                    value="whiteboard"
                    className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                  >
                    {isCompact ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center justify-center w-full h-full">
                              <Palette className="w-4 h-4" />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Whiteboard</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Palette className="w-4 h-4" />
                        Whiteboard
                      </>
                    )}
                  </TabsTrigger>
                )}
              </FeatureGuard>
              <FeatureGuard flag="notes">
                {controls?.notes !== false && (
                  <TabsTrigger
                      value="notes"
                      className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
                  >
                    {isCompact ? (
                       <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center justify-center w-full h-full">
                             <FileText className="w-4 h-4" />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Notes</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Notes
                      </>
                    )}
                  </TabsTrigger>
                )}
              </FeatureGuard>
                  <FeatureGuard flag="history">
              <TabsTrigger
                value="history"
                className="flex-1 gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none"
              >
                  {isCompact ? (
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center justify-center w-full h-full">
                             <History className="w-4 h-4" />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>History</TooltipContent>
                      </Tooltip>
                  ) : (
                    <>
                      <History className="w-4 h-4" />
                      History
                    </>
                  )}
              </TabsTrigger>
              </FeatureGuard>
            </TooltipProvider>
          </TabsList>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-none border-l">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full w-full h-[100vh] p-0 gap-0 z-50 bg-background">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full h-full flex flex-col"
              >
                <TabsList className="w-full justify-start rounded-none border-b px-4 bg-background">
                  <FeatureGuard flag="drawing">
                   {controls?.whiteboard !== false && (
                    <TabsTrigger value="whiteboard" className="gap-2">
                      <Palette className="w-4 h-4" />
                      Whiteboard
                    </TabsTrigger>
                   )}
                  </FeatureGuard>
                  <FeatureGuard flag="notes">
                   {controls?.notes !== false && (
                    <TabsTrigger value="notes" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Notes
                    </TabsTrigger>
                   )}
                  </FeatureGuard>
                  <TabsTrigger value="history" className="gap-2">
                    <History className="w-4 h-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <FeatureGuard flag="drawing">
                   {controls?.whiteboard !== false && (
                    <TabsContent value="whiteboard" className="h-full m-0">
                      <LazyWhiteboardComponent
                        algorithmId={algorithmId}
                        algorithmTitle={algorithmTitle}
                        restoreData={whiteboardRestore}
                        isExpand={isModalOpen}
                      />
                    </TabsContent>
                   )}
                  </FeatureGuard>

                  <FeatureGuard flag="notes">
                   {controls?.notes !== false && (
                    <TabsContent value="notes" className="h-full m-0">
                      <NotesComponent
                        algorithmId={algorithmId}
                        algorithmTitle={algorithmTitle}
                        restoreData={noteRestore}
                      />
                    </TabsContent>
                   )}
                  </FeatureGuard>

                  <TabsContent
                    value="history"
                    className="h-full m-0 p-4 overflow-auto"
                  >
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
        </div>

        <div className="flex-1 overflow-hidden">
          <FeatureGuard flag="drawing">
           {controls?.whiteboard !== false && (
            <TabsContent value="whiteboard" className="h-full m-0">
              <LazyWhiteboardComponent
                algorithmId={algorithmId}
                algorithmTitle={algorithmTitle}
                restoreData={whiteboardRestore}
              />
            </TabsContent>
           )}
          </FeatureGuard>

          <FeatureGuard flag="notes">
           {controls?.notes !== false && (
            <TabsContent value="notes" className="h-full m-0">
              <NotesComponent
                algorithmId={algorithmId}
                algorithmTitle={algorithmTitle}
                restoreData={noteRestore}
              />
            </TabsContent>
           )}
          </FeatureGuard>

          <TabsContent value="history" className="h-full m-0 p-4 overflow-auto">
            <HistoryTab
              algorithmId={algorithmId}
              onRestoreWhiteboard={handleRestoreWhiteboard}
              onRestoreNote={handleRestoreNote}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
