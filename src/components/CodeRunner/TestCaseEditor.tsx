import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, X } from 'lucide-react';

interface InputField {
  name: string;
  label?: string;
  type: string;
}

interface TestCase {
  id?: number;
  name?: string;
  input: any[];
  expectedOutput?: any;
}

interface TestCaseEditorProps {
  testCase: TestCase;
  inputSchema: InputField[];
  onSave: (testCase: TestCase) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export const TestCaseEditor: React.FC<TestCaseEditorProps> = ({
  testCase,
  inputSchema,
  onSave,
  onCancel,
  isEditing = true
}) => {
  const [editedInputs, setEditedInputs] = useState<string[]>(
    testCase.input.map(val => JSON.stringify(val))
  );
  const [errors, setErrors] = useState<Record<number, string>>({});

  // Sync state with props when testCase changes (e.g. after save or external update)
  React.useEffect(() => {
    setEditedInputs(testCase.input.map(val => JSON.stringify(val)));
    setErrors({});
  }, [testCase]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...editedInputs];
    newInputs[index] = value;
    setEditedInputs(newInputs);

    // Validate JSON
    try {
      JSON.parse(value);
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    } catch (err) {
      setErrors({
        ...errors,
        [index]: 'Invalid JSON format'
      });
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedInputs(testCase.input.map(val => JSON.stringify(val)));
    setErrors({});
    onCancel(); // Call parent handler if needed (e.g. to close modal)
  };

  const handleSave = () => {
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const parsedInputs = editedInputs.map(val => JSON.parse(val));
      onSave({
        ...testCase,
        input: parsedInputs
      });
    } catch (err) {
      console.error('Error saving test case:', err);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">
          {isEditing ? 'Edit Test Case' : ''}
        </h4>
      </div>

      {inputSchema.map((field, index) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={`input-${index}`} className="text-xs font-medium">
            {field.label || field.name}
            <span className="text-muted-foreground ml-1">({field.type})</span>
          </Label>
          <div className="relative">
            <Input
              id={`input-${index}`}
              value={editedInputs[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className={`font-mono text-xs ${
                errors[index] ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              placeholder={`Enter ${field.type}`}
              readOnly={!isEditing}
              disabled={!isEditing}
            />
            {errors[index] && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            )}
          </div>
          {errors[index] && (
            <p className="text-xs text-destructive">{errors[index]}</p>
          )}
        </div>
      ))}

      {hasErrors && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Please fix the validation errors before saving
          </AlertDescription>
        </Alert>
      )}

      {isEditing && (
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={hasErrors}
            size="sm"
            className="flex-1"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            size="sm"
            className="flex-1"
          >
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
