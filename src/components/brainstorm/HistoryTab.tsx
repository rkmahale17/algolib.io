import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Palette, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export const HistoryTab = () => {
  const { data: whiteboards, isLoading: loadingWhiteboards, refetch: refetchWhiteboards } = useQuery({
    queryKey: ['whiteboards'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_whiteboards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: notes, isLoading: loadingNotes, refetch: refetchNotes } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDeleteWhiteboard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_whiteboards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Whiteboard deleted');
      refetchWhiteboards();
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
      toast.error('Failed to delete whiteboard');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Note deleted');
      refetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  if (loadingWhiteboards || loadingNotes) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
              <p className="text-center text-muted-foreground">No saved whiteboards yet</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWhiteboard(board.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
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
              <p className="text-center text-muted-foreground">No saved notes yet</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};
