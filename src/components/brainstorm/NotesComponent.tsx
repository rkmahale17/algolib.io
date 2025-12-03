import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserAlgorithmData } from '@/hooks/useUserAlgorithmData';
import { updateNotes } from '@/utils/userAlgorithmDataHelpers';
import { Save, Loader2, Eye, Edit } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';

interface NotesComponentProps {
  algorithmId: string;
  algorithmTitle: string;
  restoreData?: { title: string; notes_text: string };
}

export const NotesComponent = ({ algorithmId, algorithmTitle, restoreData }: NotesComponentProps) => {
  const [title, setTitle] = useState(algorithmTitle);
  const [notes, setNotes] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get current user
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  // Fetch user algorithm data
  const { data: userAlgoData } = useUserAlgorithmData({
    userId: userId || undefined,
    algorithmId,
    enabled: !!userId,
  });

  // Load the latest note on mount or restore data
  useEffect(() => {
    if (restoreData) {
      setTitle(restoreData.title);
      setNotes(restoreData.notes_text);
    } else if (userAlgoData?.notes) {
      setNotes(userAlgoData.notes);
    }
  }, [restoreData, userAlgoData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('Please sign in to save notes');
      }

      const success = await updateNotes(userId, algorithmId, {
        notes: notes,
      });

      if (!success) throw new Error('Failed to save notes');
    },
    onSuccess: () => {
      toast.success('Notes saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['user-algorithm-data', algorithmId] });
    },
    onError: (error: any) => {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!notes.trim()) return;
    // Don't auto-save if we're still loading initial data
    if (userAlgoData === undefined) return;

    const autoSaveTimer = setTimeout(() => {
      saveMutation.mutate();
    }, 500000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [notes, title, userAlgoData]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Fixed Header Bar */}
      <div className="flex flex-wrap gap-2 items-center p-3 bg-muted/30 border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="flex-1 min-w-[200px] bg-background"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isPreview ? (
              <>
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
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
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Notes Content */}
      <div className="flex-1 p-4">
        {isPreview ? (
          <div className="min-h-[500px] lg:min-h-[700px] p-4 border rounded-lg bg-muted/30 prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{notes || '*No content yet*'}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start writing your notes... (Markdown supported)"
            className="min-h-[500px] lg:min-h-[700px] font-mono text-sm resize-none"
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <p className="text-xs text-muted-foreground">
          Auto-saves after 5 minutes of inactivity. Supports Markdown formatting.
        </p>
      </div>
    </div>
  );
};
