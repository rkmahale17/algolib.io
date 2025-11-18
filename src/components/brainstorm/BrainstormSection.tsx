import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhiteboardComponent } from './WhiteboardComponent';
import { NotesComponent } from './NotesComponent';
import { HistoryTab } from './HistoryTab';
import { Palette, FileText, History } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BrainstormSectionProps {
  algorithmId: string;
  algorithmTitle: string;
}

export const BrainstormSection = ({ algorithmId, algorithmTitle }: BrainstormSectionProps) => {
  return (
    <Card className="p-6 mt-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Brainstorm Space
        </h2>
        <p className="text-muted-foreground">
          Draw diagrams, take notes, and save your work for <span className="font-semibold text-foreground">{algorithmTitle}</span>
        </p>
      </div>

      <Tabs defaultValue="whiteboard" className="space-y-6">
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
          <WhiteboardComponent algorithmId={algorithmId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-0">
          <NotesComponent algorithmId={algorithmId} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-0">
          <HistoryTab algorithmId={algorithmId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
