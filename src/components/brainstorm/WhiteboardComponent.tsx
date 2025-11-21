import { useCallback, useState, useEffect } from "react";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface WhiteboardComponentProps {
  algorithmId: string;
  algorithmTitle: string;
  restoreData?: any;
}

interface SaveControlsProps {
  algorithmId: string;
  algorithmTitle: string;
  editor: any;
}

const SaveControls = ({ algorithmId, algorithmTitle, editor }: SaveControlsProps) => {
  const [title, setTitle] = useState(algorithmTitle);
  const [whiteboardId, setWhiteboardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Fetch the latest whiteboard for this algorithm
  const { data: latestWhiteboard } = useQuery({
    queryKey: ["latest-whiteboard", algorithmId],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_whiteboards")
        .select("*")
        .eq("user_id", user.id)
        .eq("algorithm_id", algorithmId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  useEffect(() => {
    if (latestWhiteboard) {
      setWhiteboardId(latestWhiteboard.id);
      setTitle(latestWhiteboard.title);
    }
  }, [latestWhiteboard]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const snapshot = editor.store.getSnapshot();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to save");
        return;
      }

      if (whiteboardId) {
        const { error } = await supabase
          .from("user_whiteboards")
          .update({
            title: title || algorithmTitle,
            board_json: snapshot as any,
            updated_at: new Date().toISOString(),
          })
          .eq("id", whiteboardId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("user_whiteboards")
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

      toast.success("Whiteboard saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["whiteboards", algorithmId] });
    } catch (error) {
      console.error("Error saving whiteboard:", error);
      toast.error("Failed to save whiteboard");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPNG = useCallback(async () => {
    if (!editor) return;

    try {
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size === 0) {
        toast.error("Nothing to export");
        return;
      }

      const svgElement = await editor.getSvg(Array.from(shapeIds), {
        background: true,
        darkMode: false,
      });

      if (!svgElement) {
        toast.error("Failed to generate SVG");
        return;
      }

      const svgString = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title || "whiteboard"}.png`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success("Exported as PNG!");
          }
        }, "image/png");
      };

      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Failed to export");
    }
  }, [editor, title]);

  return (
    <div className="flex flex-wrap gap-2 items-center p-3 bg-muted/30 border-b">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Whiteboard title"
        className="flex-1 min-w-[200px] bg-background"
      />
      <div className="flex gap-2">
        <Button onClick={handleExportPNG} variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export PNG</span>
        </Button>
        <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span className="hidden sm:inline">Save</span>
        </Button>
      </div>
    </div>
  );
};

export const WhiteboardComponent = ({ algorithmId, algorithmTitle, restoreData }: WhiteboardComponentProps) => {
  const [editor, setEditor] = useState<any>(null);

  return (
    <div className="flex flex-col w-full h-full">
      {editor && (
        <SaveControls algorithmId={algorithmId} algorithmTitle={algorithmTitle} editor={editor} />
      )}
      <div className="flex-1 min-h-[500px] lg:min-h-[700px] border rounded-lg overflow-hidden">
        <Tldraw
          snapshot={restoreData}
          onMount={(editor) => {
            setEditor(editor);
            
            // Load restore data if provided
            if (restoreData) {
              try {
                const snapshot = restoreData.board_json || restoreData;
                if (snapshot && typeof snapshot === 'object') {
                  editor.store.loadSnapshot(snapshot);
                } else {
                  console.warn('Invalid restore data format');
                }
              } catch (error) {
                console.error('Error loading restore data:', error);
                toast.error('Failed to load whiteboard data');
              }
            }
          }}
        />
      </div>
    </div>
  );
};
