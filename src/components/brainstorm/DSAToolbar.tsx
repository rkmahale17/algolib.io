import React from "react";
import { 
  Network, 
  Share2,
  Grid2X2,
  Link,
  GitMerge,
  Lock,
  Info
} from "lucide-react";
import { toast } from "sonner";
import {
  generateArrayElements,
  generateLinkedListElements,
  generateBinaryTreeElements,
  generateGraphElements
} from "@/utils/excalidrawDsaTemplates";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { useApp } from "@/contexts/AppContext";


interface DSAToolbarProps {
  excalidrawAPI: any;
}

export const DSAToolbar = ({ excalidrawAPI }: DSAToolbarProps) => {
  const { hasPremiumAccess } = useApp();

  const insertElements = (newElements: any[]) => {
    if (!hasPremiumAccess) {
      toast("Unlock Pro to use DSA templates", {
        icon: <Info className="w-4 h-4 text-blue-500" />
      });
      return;
    }
    if (!excalidrawAPI) {
      toast.error("Excalidraw is not ready yet.");
      return;
    }

    try {
      const currentElements = excalidrawAPI.getSceneElements();
      
      const appState = excalidrawAPI.getAppState();
      const scrollX = appState.scrollX;
      const scrollY = appState.scrollY;

      const centerX = -scrollX + (appState.width / 2) - 100;
      const centerY = -scrollY + (appState.height / 2) - 100;

      const adjustedElements = newElements.map(el => ({
        ...el,
        x: el.x + centerX,
        y: el.y + centerY,
      }));

      const finalElements = convertToExcalidrawElements(adjustedElements);

      excalidrawAPI.updateScene({
        elements: [...currentElements, ...finalElements],
      });
      
      toast.success("Inserted template!");
    } catch (error) {
      console.error("Failed to insert elements", error);
      toast.error("Failed to insert template.");
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-row items-center gap-1 p-1 bg-background/80 backdrop-blur-md border border-border/60 rounded-full shadow-sm">
      {!hasPremiumAccess && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-full cursor-pointer" 
          onClick={() => toast("Unlock Pro to use DSA templates", {
            icon: <Info className="w-4 h-4 text-blue-500" />
          })}
        >
           <Lock className="w-4 h-4 text-amber-500 drop-shadow-md" />
           <span className="ml-1 text-[10px] font-bold tracking-wider text-amber-500 uppercase drop-shadow-md">Pro</span>
        </div>
      )}
      <button
        onClick={() => insertElements(generateArrayElements(0, 0, 4))}
        className="p-1.5 hover:bg-muted/50 rounded-full transition-colors flex items-center justify-center group"
        title="Insert Array"
      >
        <Grid2X2 className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>

      <button
        onClick={() => insertElements(generateLinkedListElements(0, 0, 4))}
        className="p-1.5 hover:bg-muted/50 rounded-full transition-colors flex items-center justify-center group"
        title="Insert Linked List"
      >
        <Link className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>

      <button
        onClick={() => insertElements(generateBinaryTreeElements(0, 0))}
        className="p-1.5 hover:bg-muted/50 rounded-full transition-colors flex items-center justify-center group"
        title="Insert Binary Tree"
      >
        <GitMerge className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>

      <button
        onClick={() => insertElements(generateGraphElements(0, 0))}
        className="p-1.5 hover:bg-muted/50 rounded-full transition-colors flex items-center justify-center group"
        title="Insert Graph"
      >
        <Share2 className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
};
