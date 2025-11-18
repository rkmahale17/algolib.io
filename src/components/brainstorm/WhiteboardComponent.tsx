import { useCallback, useState } from 'react';
import { Tldraw, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface WhiteboardComponentProps {
  algorithmId: string;
  restoreData?: any;
}

const SaveButton = ({ algorithmId }: WhiteboardComponentProps) => {
  const editor = useEditor();
  const [title, setTitle] = useState('Untitled Whiteboard');
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

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

      const { error } = await supabase
        .from('user_whiteboards')
        .insert({
          user_id: user.id,
          algorithm_id: algorithmId,
          title: title || 'Untitled Whiteboard',
          board_json: snapshot as any,
        });

      if (error) throw error;

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

      // Convert SVG to PNG using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'whiteboard'}.png`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Exported as PNG!');
          }
        }, 'image/png');
      };
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      console.error('Error exporting:', error);
      toast.error('Failed to export');
    }
  }, [editor, title]);

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-lg">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Whiteboard title"
        className="w-48"
      />
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
        Save
      </Button>
      <Button
        onClick={handleExportPNG}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export PNG
      </Button>
    </div>
  );
};

export const WhiteboardComponent = ({ algorithmId, restoreData }: WhiteboardComponentProps) => {
  return (
    <div className="relative w-full h-[600px] border rounded-lg overflow-hidden">
      <Tldraw
        snapshot={restoreData}
      >
        <SaveButton algorithmId={algorithmId} />
      </Tldraw>
    </div>
  );
};
