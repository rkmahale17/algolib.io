import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Palette, Trash2, Eye, Pencil } from 'lucide-react';
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
  const queryClient = useQueryClient();
  const [viewingNote, setViewingNote] = useState<any>(null);

  const { data: whiteboards, isLoading: loadingWhiteboards } = useQuery({
    queryKey: ['whiteboards', algorithmId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_whiteboards')
        .select('*')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: notes, isLoading: loadingNotes } = useQuery({
    queryKey: ['notes', algorithmId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteWhiteboardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_whiteboards')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Whiteboard deleted');
      queryClient.invalidateQueries({ queryKey: ['whiteboards', algorithmId] });
    },
    onError: () => {
      toast.error('Failed to delete whiteboard');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: ['notes', algorithmId] });
    },
    onError: () => {
      toast.error('Failed to delete note');
    },
  });

  if (loadingWhiteboards || loadingNotes) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="whiteboards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="whiteboards" className="gap-2">
            <Palette className="w-4 h-4" />
            Whiteboards ({whiteboards?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="w-4 h-4" />
            Notes ({notes?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whiteboards" className="space-y-4">
            {!whiteboards || whiteboards.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No saved whiteboards yet for this algorithm</p>
                </CardContent>
              </Card>
            ) : (
            whiteboards.map((board) => (
              <Card key={board.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{board.title}</CardTitle>
                      <CardDescription>
                        Last updated {formatDistanceToNow(new Date(board.updated_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {onRestoreWhiteboard && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onRestoreWhiteboard(board.board_json);
                            toast.success('Whiteboard restored');
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWhiteboardMutation.mutate(board.id)}
                        disabled={deleteWhiteboardMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
            {!notes || notes.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No saved notes yet for this algorithm</p>
                </CardContent>
              </Card>
            ) : (
            notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <CardDescription>
                        Last updated {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </CardDescription>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {note.notes_text || 'Empty note'}
                      </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingNote(note)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {onRestoreNote && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onRestoreNote({ title: note.title, notes_text: note.notes_text });
                              toast.success('Note restored');
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNoteMutation.mutate(note.id)}
                          disabled={deleteNoteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{viewingNote?.notes_text || ''}</ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
