import { useCallback, useState, useEffect } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient, useQuery } from '@tanstack/react-query';

interface WhiteboardComponentProps {
  algorithmId: string;
  algorithmTitle: string;
  restoreData?: any;
}

export const WhiteboardComponent = ({
  algorithmId,
  algorithmTitle,
  restoreData,
}: WhiteboardComponentProps) => {
  const [title, setTitle] = useState(algorithmTitle);
  const [whiteboardId, setWhiteboardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editor, setEditor] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch the latest whiteboard for this algorithm
  const { data: latestWhiteboard } = useQuery({
    queryKey: ['latest-whiteboard', algorithmId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_whiteboards')
        .select('*')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Load the latest whiteboard on mount
  useEffect(() => {
    if (latestWhiteboard && editor) {
      setWhiteboardId(latestWhiteboard.id);
      setTitle(latestWhiteboard.title);
      editor.store.loadSnapshot(latestWhiteboard.board_json as any);
    }
  }, [latestWhiteboard, editor]);

  // Load restore data if provided
  useEffect(() => {
    if (restoreData && editor) {
      setWhiteboardId(restoreData.id);
      setTitle(restoreData.title);
      editor.store.loadSnapshot(restoreData.board_json as any);
    }
  }, [restoreData, editor]);

  const handleSave = async () => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      const snapshot = editor.store.getSnapshot();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to save');
        return;
      }

      // Check if whiteboard already exists
      const { data: existingWhiteboard } = await supabase
        .from('user_whiteboards')
        .select('id')
        .eq('user_id', user.id)
        .eq('algorithm_id', algorithmId)
        .maybeSingle();

      if (existingWhiteboard || whiteboardId) {
        // Update existing whiteboard
        const updateId = existingWhiteboard?.id || whiteboardId;
        const { error } = await supabase
          .from('user_whiteboards')
          .update({
            title: title || algorithmTitle,
            board_json: snapshot as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', updateId)
          .eq('user_id', user.id);

        if (error) throw error;
        if (!whiteboardId) setWhiteboardId(updateId);
      } else {
        // Create new whiteboard
        const { data, error } = await supabase
          .from('user_whiteboards')
          .insert({
            user_id: user.id,
            algorithm_id: algorithmId,
            title: title || algorithmTitle,
            board_json: snapshot as any,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setWhiteboardId(data.id);
      }

      toast.success('Whiteboard saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['whiteboards', algorithmId] });
    } catch (error) {
      console.error('Error saving whiteboard:', error);
      toast.error('Failed to save whiteboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPNG = useCallback(async () => {
    if (!editor) return;

    try {
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        toast.error('Nothing to export');
        return;
      }

      const svgElement = await editor.getSvg(Array.from(shapeIds), {
        background: true,
        darkMode: false,
      });

      if (!svgElement) {
        toast.error('Failed to generate SVG');
        return;
      }

      // Convert SVG element to string
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Create image element to draw on canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.width.baseVal.value;
        canvas.height = svgElement.height.baseVal.value;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = pngUrl;
              a.download = `${title || 'whiteboard'}.png`;
              a.click();
              URL.revokeObjectURL(pngUrl);
            }
          });
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;

      toast.success('Exported as PNG!');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      toast.error('Failed to export PNG');
    }
  }, [editor, title]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Fixed Header Bar */}
      <div className="flex flex-wrap gap-2 items-center p-3 bg-muted/30 border-b border-border">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Whiteboard title"
          className="flex-1 min-w-[200px] bg-background"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            onClick={handleExportPNG}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Whiteboard Canvas */}
      <div className="relative flex-1 min-h-[500px] lg:min-h-[700px]">
        <Tldraw onMount={setEditor} />
      </div>
    </div>
  );
};
