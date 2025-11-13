import { cn } from "@/lib/utils";

interface SlidingWindowArrayProps {
  array: number[];
  left: number;
  right: number;
  messageType: "success" | "error" | "info" | null;
}

export const SlidingWindowArray = ({
  array,
  left,
  right,
  messageType,
}: SlidingWindowArrayProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center items-center p-6 bg-muted/30 rounded-lg">
      {array.map((value, index) => {
        const isInWindow = index >= left && index <= right;
        const isLeftPointer = index === left;
        const isRightPointer = index === right;
        
        return (
          <div key={index} className="relative">
            {/* Cell */}
            <div
              className={cn(
                "w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-300",
                "border-2",
                isInWindow && "scale-110",
                isInWindow && messageType === "success" && "bg-green-500/20 border-green-500 animate-pulse",
                isInWindow && messageType === "error" && "bg-red-500/20 border-red-500 animate-shake",
                isInWindow && !messageType && "bg-primary/20 border-primary",
                !isInWindow && "bg-muted border-border"
              )}
            >
              {value}
            </div>
            
            {/* Pointer labels */}
            {isLeftPointer && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-primary">
                L
              </div>
            )}
            {isRightPointer && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-secondary">
                R
              </div>
            )}
            
            {/* Index label */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              {index}
            </div>
          </div>
        );
      })}
    </div>
  );
};
