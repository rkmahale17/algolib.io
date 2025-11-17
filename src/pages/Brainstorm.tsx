import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhiteboardComponent } from '@/components/brainstorm/WhiteboardComponent';
import { NotesComponent } from '@/components/brainstorm/NotesComponent';
import { HistoryTab } from '@/components/brainstorm/HistoryTab';
import { Palette, FileText, History } from 'lucide-react';

const Brainstorm = () => {
  return (
    <>
      <Helmet>
        <title>Brainstorm - AlgoLib</title>
        <meta name="description" content="Visualize algorithms with whiteboards and notes" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Brainstorm</h1>
          <p className="text-muted-foreground">
            Create visual diagrams and notes to understand algorithms better
          </p>
        </div>

        <Tabs defaultValue="whiteboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
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

          <TabsContent value="whiteboard" className="space-y-4">
            <WhiteboardComponent />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <NotesComponent />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Brainstorm;
