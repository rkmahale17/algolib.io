import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ArrayEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  description?: string;
}

export function ArrayEditor({
  label,
  items,
  onChange,
  placeholder = "Enter item...",
  maxItems,
  description,
}: ArrayEditorProps) {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim() && (!maxItems || items.length < maxItems)) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Existing Items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Input
                value={item}
                onChange={(e) => handleUpdate(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            No items yet. Add your first item below.
          </div>
        )}
      </div>

      {/* Add New Item */}
      {(!maxItems || items.length < maxItems) && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!newItem.trim()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      )}

      {maxItems && (
        <p className="text-xs text-muted-foreground">
          {items.length} / {maxItems} items
        </p>
      )}
    </div>
  );
}
