import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Palette, Eye, Pencil } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

interface HistoryTabProps {
  algorithmId: string;
  onRestoreWhiteboard?: (boardData: any) => void;
  onRestoreNote?: (noteData: any) => void;
}

export const HistoryTab = ({ algorithmId, onRestoreWhiteboard, onRestoreNote }: HistoryTabProps) => {
  const [viewingNote, setViewingNote] = useState<any>(null);

  // Fetch current user algorithm data (consolidated table)
  const { data: userAlgoData, isLoading } = useQuery({
    queryKey: ['user-algorithm-data-history', algorithmId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_algorithm_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasWhiteboard = userAlgoData?.whiteboard_data && typeof userAlgoData.whiteboard_data === 'object';
  const hasNotes = userAlgoData?.notes && userAlgoData.notes.trim().length > 0;

  return (
    <>
      <Tabs defaultValue="whiteboards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="whiteboards" className="gap-2">
            <Palette className="w-4 h-4" />
            Whiteboard {hasWhiteboard ? '(Saved)' : '(Empty)'}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="w-4 h-4" />
            Notes {hasNotes ? '(Saved)' : '(Empty)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboards" className="space-y-4">
          {!hasWhiteboard ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No whiteboard saved yet for this algorithm</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Current Whiteboard</CardTitle>
                    <CardDescription>
                      Last updated {formatDistanceToNow(new Date(userAlgoData.updated_at), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {onRestoreWhiteboard && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onRestoreWhiteboard(userAlgoData.whiteboard_data);
                          toast.success('Whiteboard loaded');
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          {!hasNotes ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No notes saved yet for this algorithm</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Current Notes</CardTitle>
                    <CardDescription>
                      Last updated {formatDistanceToNow(new Date(userAlgoData.updated_at), { addSuffix: true })}
                    </CardDescription>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {userAlgoData.notes}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingNote({ notes_text: userAlgoData.notes })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {onRestoreNote && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onRestoreNote({ title: '', notes_text: userAlgoData.notes });
                          toast.success('Notes loaded');
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notes Preview</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{viewingNote?.notes_text || ''}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
