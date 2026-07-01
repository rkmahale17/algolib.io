import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VisualizationFeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  algorithmId: string;
  algorithmName?: string;
  userId?: string | null;
}

const FEEDBACK_OPTIONS = [
  { id: "sync", label: "Steps are not in sync" },
  { id: "capture", label: "Steps not proper captured" },
  { id: "visuals", label: "Visuals not upto mark" },
  { id: "code", label: "Code doesn't match logic" },
  { id: "explanation", label: "Explanation is confusing or unclear" },
];

export const VisualizationFeedbackModal = ({
  isOpen,
  onOpenChange,
  algorithmId,
  algorithmName,
  userId,
}: VisualizationFeedbackModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleToggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setSelectedOptions([]);
    setReviewText("");
    setIsSuccess(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onOpenChange(false);
      // Wait for modal exit animation to complete before resetting
      setTimeout(resetForm, 300);
    } else if (open) {
      onOpenChange(true);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }

      const { error } = await supabase
        .from("visualization_feedback")
        .insert({
          algorithm_id: algorithmId,
          user_id: userId || null,
          rating,
          feedback_checkboxes: selectedOptions,
          review_text: reviewText.trim() || null,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Thank you for your feedback!");
      
      // Close automatically after showing success state
      setTimeout(() => {
        handleOpenChange(false);
      }, 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl">
              Rate {algorithmName || "Visualization"}
            </DialogTitle>
            <DialogDescription>
              Help us improve this visualization. What did you think?
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Feedback Received
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your input helps us make learning better.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Star Rating Section */}
                <div className="flex flex-col items-center justify-center space-y-2 py-2">
                  <div className="flex items-center space-x-1" onMouseLeave={() => setHoveredRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoveredRating || rating) >= star;
                      return (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          className={`p-1 focus:outline-none transition-colors ${
                            isActive ? "text-amber-400" : "text-muted-foreground/30"
                          }`}
                        >
                          <Star
                            className={`w-8 h-8 transition-all ${
                              isActive ? "fill-amber-400" : "fill-transparent stroke-[1.5]"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground min-h-[16px]">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                    {rating === 0 && hoveredRating > 0 && "Select rating"}
                  </span>
                </div>

                {/* Checkboxes Section */}
                <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/30">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Common issues
                  </p>
                  {FEEDBACK_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`feedback-${option.id}`}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleToggleOption(option.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={`feedback-${option.id}`}
                        className="text-sm font-medium leading-tight cursor-pointer text-foreground/80 hover:text-foreground transition-colors select-none"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Review Text Area */}
                <div className="space-y-2">
                  <label htmlFor="review" className="text-sm font-medium text-muted-foreground">
                    Additional review
                  </label>
                  <Textarea
                    id="review"
                    placeholder="Tell us more about your experience (optional)..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="resize-none h-24 focus-visible:ring-primary/30"
                  />
                </div>

                {/* Submit Action */}
                <Button
                  className="w-full relative overflow-hidden group transition-all"
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                >
                  <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                    Submit Feedback
                  </span>
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
