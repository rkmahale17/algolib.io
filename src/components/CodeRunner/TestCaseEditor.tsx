import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Check, X, Edit2 } from 'lucide-react';

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
  onEdit?: () => void;
  canEdit?: boolean;
}

export const TestCaseEditor: React.FC<TestCaseEditorProps> = ({
  testCase,
  inputSchema,
  onSave,
  onCancel,
  isEditing = false,
  onEdit,
  canEdit = false
}) => {
  const [editedInputs, setEditedInputs] = useState<string[]>(
    testCase.input.map(val => JSON.stringify(val))
  );
  const [editedExpected, setEditedExpected] = useState<string>(
    testCase.expectedOutput !== undefined ? JSON.stringify(testCase.expectedOutput) : ''
  );
  // Errors can be indexed by input index (number) or field name (string) like 'expected'
  const [errors, setErrors] = useState<Record<string | number, string>>({});

  // Sync state with props when testCase changes (e.g. after save or external update)
  React.useEffect(() => {
    setEditedInputs(testCase.input.map(val => JSON.stringify(val)));
    setEditedExpected(testCase.expectedOutput !== undefined ? JSON.stringify(testCase.expectedOutput) : '');
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

  const handleExpectedChange = (value: string) => {
    setEditedExpected(value);
    
    // Validate JSON
    try {
      JSON.parse(value);
      const newErrors = { ...errors };
      delete newErrors['expected'];
      setErrors(newErrors);
    } catch (err) {
      setErrors({
        ...errors,
        'expected': 'Invalid JSON format'
      });
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedInputs(testCase.input.map(val => JSON.stringify(val)));
    setEditedExpected(testCase.expectedOutput !== undefined ? JSON.stringify(testCase.expectedOutput) : '');
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
      const parsedExpected = JSON.parse(editedExpected);
      onSave({
        ...testCase,
        input: parsedInputs,
        expectedOutput: parsedExpected
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
          {isEditing ? 'Edit Test Case' : 'Test Case Details'}
        </h4>
        {!isEditing && canEdit && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}>
                <Edit2 className="h-3 w-3" />
            </Button>
        )}
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

      <div className="space-y-1.5 pt-2 border-t mt-2">
        <Label htmlFor="input-expected" className="text-xs font-medium">
          Expected Output
          <span className="text-muted-foreground ml-1">(JSON)</span>
        </Label>
        <div className="relative">
          <Input
            id="input-expected"
            value={editedExpected}
            onChange={(e) => handleExpectedChange(e.target.value)}
            className={`font-mono text-xs ${
              errors['expected'] ? 'border-destructive focus-visible:ring-destructive' : ''
            }`}
            placeholder="e.g. [1, 2] or 5 or true"
            readOnly={!isEditing}
            disabled={!isEditing}
          />
          {errors['expected'] && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
          )}
        </div>
        {errors['expected'] && (
          <p className="text-xs text-destructive">{errors['expected']}</p>
        )}
      </div>

      {hasErrors && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Please fix the validation errors before saving
          </AlertDescription>
        </Alert>
      )}

      {isEditing && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={hasErrors}
            size="sm"
            className="h-7 text-xs"
          >
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      )}
    </div>
  );
};
