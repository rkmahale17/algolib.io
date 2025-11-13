import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortMode } from "@/pages/SortHero";
import { BookOpen, Zap, Target } from "lucide-react";

interface AlgorithmExplainerProps {
  mode: SortMode;
}

const algorithmInfo = {
  bubble: {
    title: "Bubble Sort",
    description: "Compare adjacent elements and swap if they're in wrong order. Repeat until sorted.",
    rules: [
      "Only swap adjacent numbers",
      "Swap only if left number > right number",
      "Larger numbers 'bubble' to the right"
    ],
    tips: [
      "Start from the left side",
      "After each pass, the rightmost element is in correct position",
      "Look for the largest unsorted number"
    ],
    complexity: "O(n²) time • O(1) space",
    icon: Zap
  },
  selection: {
    title: "Selection Sort",
    description: "Find the minimum element and place it at the beginning. Repeat for remaining elements.",
    rules: [
      "Find the smallest unsorted number",
      "Move it to the next sorted position",
      "The sorted section grows from left to right"
    ],
    tips: [
      "Scan through all unsorted numbers",
      "Select the minimum value",
      "Place it at the current position"
    ],
    complexity: "O(n²) time • O(1) space",
    icon: Target
  },
  quick: {
    title: "QuickSort",
    description: "Choose a pivot, partition elements around it (smaller left, larger right), then recursively sort.",
    rules: [
      "Numbers smaller than pivot go left",
      "Numbers larger than pivot go right",
      "Pivot is in its final sorted position"
    ],
    tips: [
      "The pivot (highlighted) divides the array",
      "Move small numbers to the left section",
      "Move large numbers to the right section"
    ],
    complexity: "O(n log n) avg • O(log n) space",
    icon: BookOpen
  }
};

export const AlgorithmExplainer = ({ mode }: AlgorithmExplainerProps) => {
  const info = algorithmInfo[mode];
  const Icon = info.icon;

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{info.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{info.description}</p>
        
        <div>
          <h4 className="text-sm font-semibold mb-2">Rules:</h4>
          <ul className="space-y-1">
            {info.rules.map((rule, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Tips:</h4>
          <ul className="space-y-1">
            {info.tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-secondary mt-0.5">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono">{info.complexity}</p>
        </div>
      </CardContent>
    </Card>
  );
};
