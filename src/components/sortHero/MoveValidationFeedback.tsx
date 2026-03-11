import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveValidationFeedbackProps {
  isValid: boolean | null;
  message: string;
}

export const MoveValidationFeedback = ({ isValid, message }: MoveValidationFeedbackProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isValid !== null) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isValid, message]);

  if (!show || isValid === null) return null;

  return (
    <div
      className={cn(
        "fixed top-20 left-1/2 -translate-x-1/2 z-50",
        "px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm",
        "flex items-center gap-3 animate-in fade-in slide-in-from-top-4",
        "transition-all duration-300",
        isValid 
          ? "bg-green-500/90 text-white" 
          : "bg-destructive/90 text-destructive-foreground"
      )}
    >
      {isValid ? (
        <CheckCircle2 className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <p className="font-medium text-sm">{message}</p>
      {!isValid && <Lightbulb className="w-4 h-4 ml-2 opacity-70" />}
    </div>
  );
};
