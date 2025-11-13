import { cn } from "@/lib/utils";

interface TwoPointerArrayProps {
  array: number[];
  left: number;
  right: number;
  messageType: "success" | "error" | "info" | null;
}

export const TwoPointerArray = ({
  array,
  left,
  right,
  messageType,
}: TwoPointerArrayProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 justify-center items-center p-6 bg-muted/30 rounded-lg">
        {array.map((value, index) => {
          const isLeft = index === left;
          const isRight = index === right;
          const isBetween = index > left && index < right;
          
          return (
            <div key={index} className="relative">
              {/* Cell */}
              <div
                className={cn(
                  "w-16 h-16 flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-300",
                  "border-2",
                  isLeft && "scale-110 bg-blue-500/20 border-blue-500",
                  isRight && "scale-110 bg-red-500/20 border-red-500",
                  isBetween && "bg-muted/50 border-muted",
                  !isLeft && !isRight && !isBetween && "bg-background border-border",
                  (isLeft || isRight) && messageType === "success" && "animate-pulse",
                  (isLeft || isRight) && messageType === "error" && "animate-shake"
                )}
              >
                {value}
              </div>
              
              {/* Pointer labels */}
              {isLeft && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-blue-500 mb-1">LEFT</div>
                    <div className="text-2xl text-blue-500">↓</div>
                  </div>
                </div>
              )}
              {isRight && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl text-red-500">↑</div>
                    <div className="text-xs font-bold text-red-500 mt-1">RIGHT</div>
                  </div>
                </div>
              )}
              
              {/* Index label */}
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 text-xs text-muted-foreground",
                isLeft ? "-top-14" : isRight ? "-bottom-14" : "-bottom-6"
              )}>
                [{index}]
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Connection line between pointers */}
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          <span className="text-blue-500 font-bold">L={left}</span>
          {" "}———{" "}
          <span className="text-red-500 font-bold">R={right}</span>
        </div>
      </div>
    </div>
  );
};
