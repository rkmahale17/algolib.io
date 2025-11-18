import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhiteboardComponent } from './WhiteboardComponent';
import { NotesComponent } from './NotesComponent';
import { HistoryTab } from './HistoryTab';
import { Palette, FileText, History, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface BrainstormSectionProps {
  algorithmId: string;
  algorithmTitle: string;
}

export const BrainstormSection = ({ algorithmId, algorithmTitle }: BrainstormSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [whiteboardRestore, setWhiteboardRestore] = useState<any>(null);
  const [noteRestore, setNoteRestore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('whiteboard');

  const handleRestoreWhiteboard = (boardData: any) => {
    setWhiteboardRestore(boardData);
    setActiveTab('whiteboard');
    setIsOpen(true);
  };

  const handleRestoreNote = (noteData: any) => {
    setNoteRestore(noteData);
    setActiveTab('notes');
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
                  Draw diagrams, take notes, and save your work for <span className="font-semibold text-foreground">{algorithmTitle}</span>
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

        <CollapsibleContent>
          <div className="p-6 pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="whiteboard" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Palette className="w-4 h-4" />
                  Whiteboard
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="w-4 h-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whiteboard" className="space-y-4 mt-0">
                <WhiteboardComponent algorithmId={algorithmId} restoreData={whiteboardRestore} />
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-0">
                <NotesComponent algorithmId={algorithmId} restoreData={noteRestore} />
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
