import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Loader2, Eye, Edit } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

interface NotesComponentProps {
  algorithmId: string;
}

export const NotesComponent = ({ algorithmId }: NotesComponentProps) => {
  const [title, setTitle] = useState('Untitled Note');
  const [notes, setNotes] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please sign in to save notes');
      }

      const { error } = await supabase
        .from('user_notes')
        .insert({
          user_id: user.id,
          algorithm_id: algorithmId,
          title: title || 'Untitled Note',
          notes_text: notes,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Notes saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes', algorithmId] });
    },
    onError: (error: any) => {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!notes.trim()) return;

    const autoSaveTimer = setTimeout(() => {
      saveMutation.mutate();
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [notes, title]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="flex-1"
        />
        <Button
          onClick={() => setIsPreview(!isPreview)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isPreview ? (
            <>
              <Edit className="w-4 h-4" />
              Edit
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          size="sm"
          className="gap-2"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Now
        </Button>
      </div>

      {isPreview ? (
        <div className="min-h-[400px] p-4 border rounded-lg bg-muted/30 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{notes || '*No content yet*'}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start writing your notes... (Markdown supported)"
          className="min-h-[400px] font-mono text-sm"
        />
      )}

      <p className="text-xs text-muted-foreground">
        Auto-saves after 5 seconds of inactivity. Supports Markdown formatting.
      </p>
    </div>
  );
};
