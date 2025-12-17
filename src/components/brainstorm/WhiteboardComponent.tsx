import "tldraw/tldraw.css";

import { Download, Loader2, Save } from "lucide-react";
import { Tldraw, useEditor } from "tldraw";
import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";
import { updateWhiteboard } from "@/utils/userAlgorithmDataHelpers";

interface WhiteboardComponentProps {
  algorithmId: string;
  algorithmTitle: string;
  restoreData?: any;
  isExpand?: boolean;
}

const SaveButton = ({
  algorithmId,
  algorithmTitle,
}: WhiteboardComponentProps) => {
  const editor = useEditor();
  const [title, setTitle] = useState(algorithmTitle);
  const [whiteboardId, setWhiteboardId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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

  // Load the latest whiteboard on mount
  useEffect(() => {
    if (userAlgoData?.whiteboard_data && editor) {
      try {
        // Validate whiteboard data has required structure
        if (userAlgoData.whiteboard_data && typeof userAlgoData.whiteboard_data === 'object') {
          editor.store.loadSnapshot(userAlgoData.whiteboard_data as any);
          
          // Center the canvas on the content after loading
          setTimeout(() => {
            editor.zoomToFit();
          }, 100);
        }
      } catch (error) {
        console.error('Error loading whiteboard data:', error);
        // Silently fail - whiteboard will start empty
      }
    }
  }, [userAlgoData, editor]);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const snapshot = editor.store.getSnapshot();

      if (!userId) {
        toast.error("Please sign in to save");
        return;
      }

      const success = await updateWhiteboard(userId, algorithmId, {
        whiteboard_data: snapshot as any,
      });

      if (!success) throw new Error('Failed to save whiteboard');

      toast.success("Whiteboard saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-algorithm-data", algorithmId] });
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

      // Convert SVG element to string
      const svgString = new XMLSerializer().serializeToString(svgElement);

      // Convert SVG to PNG using canvas
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

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    } catch (error) {
      console.error("Error exporting:", error);
      toast.error("Failed to export");
    }
  }, [editor, title]);

  return (
    <div className="relative top-0  z-10 flex gap-2 bg-background border border-border p-3 ">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Whiteboard title"
        className="bg-background text-foreground border-border"
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
      <Button onClick={handleExportPNG} size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        Export PNG
      </Button>
    </div>
  );
};

export const WhiteboardComponent = ({
  algorithmId,
  algorithmTitle,
  restoreData,
  isExpand,
}: WhiteboardComponentProps) => {
  return (
    <div
      className={` relative w-full  border rounded-lg overflow-hidden z-10 ${
        isExpand ? "h-full" : "h-[700px]"
      }`}
    >
      <Tldraw snapshot={restoreData} className="tldraw-rulcode">
        <div>
          <SaveButton
            algorithmId={algorithmId}
            algorithmTitle={algorithmTitle}
          />
        </div>
      </Tldraw>
    </div>
  );
};
