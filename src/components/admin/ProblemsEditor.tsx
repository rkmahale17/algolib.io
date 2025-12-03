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
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Problem {
  type: "easy" | "medium" | "hard";
  url: string;
  title: string;
}

interface ProblemsData {
  internal: string[];
  external: Problem[];
}

interface ProblemsEditorProps {
  data: ProblemsData;
  onChange: (data: ProblemsData) => void;
}

export function ProblemsEditor({ data, onChange }: ProblemsEditorProps) {
  const [newInternal, setNewInternal] = useState("");
  const [newExternal, setNewExternal] = useState<Problem>({
    type: "easy",
    url: "",
    title: "",
  });

  const addInternal = () => {
    if (newInternal.trim()) {
      onChange({
        ...data,
        internal: [...data.internal, newInternal.trim()],
      });
      setNewInternal("");
    }
  };

  const removeInternal = (index: number) => {
    onChange({
      ...data,
      internal: data.internal.filter((_, i) => i !== index),
    });
  };

  const addExternal = () => {
    if (newExternal.url && newExternal.title) {
      onChange({
        ...data,
        external: [...data.external, newExternal],
      });
      setNewExternal({ type: "easy", url: "", title: "" });
    }
  };

  const removeExternal = (index: number) => {
    onChange({
      ...data,
      external: data.external.filter((_, i) => i !== index),
    });
  };

  const updateExternal = (index: number, updates: Partial<Problem>) => {
    const updated = [...data.external];
    updated[index] = { ...updated[index], ...updates };
    onChange({ ...data, external: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Practice Problems</h3>
        <p className="text-sm text-muted-foreground">
          Add related problems for users to practice
        </p>
      </div>

      <Tabs defaultValue="external">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="external">External Problems</TabsTrigger>
          <TabsTrigger value="internal">Internal Problems</TabsTrigger>
        </TabsList>

        {/* External Problems */}
        <TabsContent value="external" className="space-y-4 mt-4">
          {/* Existing External Problems */}
          <div className="space-y-3">
            {data.external.map((problem, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={problem.title}
                            onChange={(e) =>
                              updateExternal(index, { title: e.target.value })
                            }
                            placeholder="Problem title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <Select
                            value={problem.type}
                            onValueChange={(value: any) =>
                              updateExternal(index, { type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={problem.url}
                          onChange={(e) =>
                            updateExternal(index, { url: e.target.value })
                          }
                          placeholder="https://leetcode.com/problems/..."
                          type="url"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExternal(index)}
                      className="text-destructive hover:text-destructive mt-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New External Problem */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Add External Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newExternal.title}
                    onChange={(e) =>
                      setNewExternal({ ...newExternal, title: e.target.value })
                    }
                    placeholder="Two Sum"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select
                    value={newExternal.type}
                    onValueChange={(value: any) =>
                      setNewExternal({ ...newExternal, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL *</Label>
                <Input
                  value={newExternal.url}
                  onChange={(e) =>
                    setNewExternal({ ...newExternal, url: e.target.value })
                  }
                  placeholder="https://leetcode.com/problems/two-sum"
                  type="url"
                />
              </div>
              <Button
                type="button"
                onClick={addExternal}
                disabled={!newExternal.url || !newExternal.title}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Problem
              </Button>
            </CardContent>
          </Card>

          {data.external.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No external problems added yet
            </div>
          )}
        </TabsContent>

        {/* Internal Problems */}
        <TabsContent value="internal" className="space-y-4 mt-4">
          <div className="space-y-3">
            {data.internal.map((problem, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Input value={problem} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInternal(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newInternal}
              onChange={(e) => setNewInternal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addInternal();
                }
              }}
              placeholder="Internal problem ID"
            />
            <Button
              type="button"
              onClick={addInternal}
              disabled={!newInternal.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {data.internal.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No internal problems added yet
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
