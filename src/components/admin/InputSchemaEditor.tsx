import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface SchemaField {
  name: string;
  type: string;
  label: string;
  defaultValue?: any;
}

interface InputSchemaEditorProps {
  schema: SchemaField[];
  onChange: (schema: SchemaField[]) => void;
}

const FIELD_TYPES = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "number[]", label: "Number Array" },
  { value: "string[]", label: "String Array" },
  { value: "number[][]", label: "2D Number Array" },
  { value: "string[][]", label: "2D String Array" },
  { value: "boolean[][]", label: "2D Boolean Array" },
  { value: "object", label: "Object" },
];

export function InputSchemaEditor({ schema, onChange }: InputSchemaEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState<SchemaField>({
    name: "",
    type: "string",
    label: "",
  });

  const handleAdd = () => {
    if (newField.name && newField.label) {
      onChange([...schema, newField]);
      setNewField({ name: "", type: "string", label: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(schema.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: Partial<SchemaField>) => {
    const updated = [...schema];
    updated[index] = { ...updated[index], ...field };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Input Schema</h3>
          <p className="text-sm text-muted-foreground">
            Define the input parameters for this algorithm
          </p>
        </div>
        {!isAdding && (
          <Button
            type="button"
            onClick={() => setIsAdding(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        )}
      </div>

      {/* Existing Fields */}
      <div className="space-y-3">
        {schema.map((field, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-2 cursor-move" />
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={field.name}
                      onChange={(e) =>
                        handleUpdate(index, { name: e.target.value })
                      }
                      placeholder="e.g., arr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) =>
                        handleUpdate(index, { type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={`${type.value}-option`} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        handleUpdate(index, { label: e.target.value })
                      }
                      placeholder="e.g., Array"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-destructive hover:text-destructive mt-7"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Field Form */}
      {isAdding && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">New Input Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  placeholder="e.g., arr"
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value) =>
                    setNewField({ ...newField, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Label *</Label>
                <Input
                  value={newField.label}
                  onChange={(e) =>
                    setNewField({ ...newField, label: e.target.value })
                  }
                  placeholder="e.g., Array"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewField({ name: "", type: "string", label: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!newField.name || !newField.label}
              >
                Add Field
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {schema.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No input fields defined. Click "Add Field" to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
