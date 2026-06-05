import "tldraw/tldraw.css";

import { Download, Loader2, Save } from "lucide-react";
import { Tldraw, useEditor } from "tldraw";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

  // Track whether we've already loaded the saved snapshot into the editor.
  // We only want to do this once on mount — not on every realtime update,
  // which would overwrite the user's in-progress drawing.
  const hasLoadedRef = useRef(false);

  // Load the latest whiteboard on mount
  useEffect(() => {
    // Only load once; stop if already loaded or dependencies aren't ready
    if (hasLoadedRef.current || !userAlgoData || !editor) return;

    const snapshotData = userAlgoData.whiteboard_data;
    if (!snapshotData || typeof snapshotData !== 'object') return;

    try {
      editor.store.loadSnapshot(snapshotData as any);
      hasLoadedRef.current = true;

      // Center the canvas on the content after loading
      setTimeout(() => {
        editor.zoomToFit();
      }, 100);
    } catch (error) {
      console.error('Error loading whiteboard data:', error);
      // Mark as loaded even on error so we don't keep retrying
      hasLoadedRef.current = true;
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
    <div className="relative top-0 z-10 flex items-center gap-3 p-2 border-b border-border/50 bg-background text-foreground shadow-sm">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Whiteboard title"
        className="h-9 max-w-[250px] text-sm bg-background text-foreground border-border/60 rounded-xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all"
      />
      <div className="flex items-center h-9 rounded-xl border border-border/60 bg-muted/30 dark:bg-muted/20 overflow-hidden shadow-sm shrink-0 select-none">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-1.5 h-full px-4 text-[12px] font-semibold tracking-wide transition-all duration-200 text-foreground/80 hover:text-foreground hover:bg-muted/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save
        </button>
        <div className="w-px h-5 bg-border/60 shrink-0" />
        <button 
          onClick={handleExportPNG} 
          className="flex items-center justify-center gap-1.5 h-full px-4 text-[12px] font-semibold tracking-wide transition-all duration-200 text-foreground/80 hover:text-foreground hover:bg-muted/50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export PNG
        </button>
      </div>
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
      className={` relative w-full h-full border rounded-none overflow-hidden z-10`}
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
