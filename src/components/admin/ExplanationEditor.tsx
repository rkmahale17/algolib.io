import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrayEditor } from "./ArrayEditor";
import { IOExamplesEditor } from "./IOExamplesEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface ExplanationData {
  problemStatement: string;
  useCase: string;
  note: string;
  steps: string | string[];
  tips: string | string[];
  comparisonTable?: string; // HTML string
  constraints: string[];
  io: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
}

interface ExplanationEditorProps {
  data: ExplanationData;
  onChange: (data: ExplanationData) => void;
}

export function ExplanationEditor({ data, onChange }: ExplanationEditorProps) {
  const updateField = <K extends keyof ExplanationData>(
    field: K,
    value: ExplanationData[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.problemStatement}
            onChange={(e) => updateField("problemStatement", e.target.value)}
            placeholder="Describe the problem this algorithm solves..."
            className="min-h-[350px]"
          />
        </CardContent>
      </Card>

      {/* Use Case */}
      <Card>
        <CardHeader>
          <CardTitle>Use Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.useCase}
            onChange={(e) => updateField("useCase", e.target.value)}
            placeholder="Where is this algorithm commonly used?"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Input/Output Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <IOExamplesEditor
            examples={data.io}
            onChange={(io) => updateField("io", io)}
          />
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
             value={Array.isArray(data.steps) ? data.steps.join('\n') : data.steps}
             onChange={(e) => updateField("steps", e.target.value)}
             placeholder="Enter steps (HTML supported)..."
             rows={5}
          />
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Tips & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={Array.isArray(data.tips) ? data.tips.join('\n') : data.tips}
            onChange={(e) => updateField("tips", e.target.value)}
            placeholder="Add tips (HTML supported)..."
            rows={5}
          />
        </CardContent>
      </Card>
      
      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comparison Table (HTML)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.comparisonTable || ''}
            onChange={(e) => updateField("comparisonTable", e.target.value)}
            placeholder="Enter comparison table HTML..."
            rows={5}
            className="font-mono text-xs"
          />
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card>
        <CardHeader>
          <CardTitle>Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <ArrayEditor
            label="Constraints"
            items={data.constraints}
            onChange={(constraints) => updateField("constraints", constraints)}
            placeholder="Add a constraint..."
            description="Input constraints or limitations"
          />
        </CardContent>
      </Card>

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.note}
            onChange={(e) => updateField("note", e.target.value)}
            placeholder="Any additional notes or important information..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}

