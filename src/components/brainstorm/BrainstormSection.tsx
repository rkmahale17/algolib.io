import {
  Maximize,
  Palette,
  FileText,
  History,
  CheckCircle2,
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
  drawingCompleted?: boolean;
  onToggleDrawingCompleted?: () => void;
}

export const BrainstormSection = ({
  algorithmId,
  algorithmTitle,
  controls,
  drawingCompleted = false,
  onToggleDrawingCompleted,
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
        <div className="flex items-center justify-between border-b shrink-0">
          <TabsList className="flex p-0 bg-transparent gap-0 rounded-none h-10">
            <TooltipProvider>
              <FeatureGuard flag="drawing">
                {controls?.whiteboard !== false && (
                  <TabsTrigger
                    value="whiteboard"
                    className="px-4 h-10 gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white border-b-[2px] border-transparent data-[state=active]:border-primary rounded-none transition-all"
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
                    className="px-4 h-10 gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white border-b-[2px] border-transparent data-[state=active]:border-primary rounded-none transition-all"
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
                  className="px-4 h-10 gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white border-b-[2px] border-transparent data-[state=active]:border-primary rounded-none transition-all"
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
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none border-l">
                <Maximize className="w-4 h-4" />
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
                      <TabsTrigger value="whiteboard" className="gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white">
                        <Palette className="w-4 h-4" />
                        Whiteboard
                      </TabsTrigger>
                    )}
                  </FeatureGuard>
                  <FeatureGuard flag="notes">
                    {controls?.notes !== false && (
                      <TabsTrigger value="notes" className="gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white">
                        <FileText className="w-4 h-4" />
                        Notes
                      </TabsTrigger>
                    )}
                  </FeatureGuard>
                  <TabsTrigger value="history" className="gap-2 text-[12px] data-[state=active]:bg-transparent data-[state=active]:text-black dark:data-[state=active]:text-white">
                    <History className="w-4 h-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden relative">
                  {activeTab === "whiteboard" && (
                    <button
                      onClick={onToggleDrawingCompleted}
                      className={`absolute bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 border select-none ${
                        drawingCompleted
                          ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/25"
                          : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground hover:bg-background/95"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{drawingCompleted ? "Completed" : "Mark Complete"}</span>
                    </button>
                  )}
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

        <div className="flex-1 overflow-hidden relative">
          {activeTab === "whiteboard" && (
            <button
              onClick={onToggleDrawingCompleted}
              className={`absolute bottom-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 border select-none ${
                drawingCompleted
                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/25"
                  : "bg-background/80 border-border/60 text-muted-foreground hover:text-foreground hover:bg-background/95"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{drawingCompleted ? "Completed" : "Mark Complete"}</span>
            </button>
          )}
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
