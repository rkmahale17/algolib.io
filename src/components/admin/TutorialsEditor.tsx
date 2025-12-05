import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Video, FileText } from "lucide-react";

interface Tutorial {
  type: "youtube" | "article" | "other";
  url: string;
  title?: string;
  credits?: string;
  moreInfo?: string; // HTML content
}

interface TutorialsEditorProps {
  tutorials: Tutorial[];
  onChange: (tutorials: Tutorial[]) => void;
}

export function TutorialsEditor({ tutorials = [], onChange }: TutorialsEditorProps) {
  const [newTutorial, setNewTutorial] = useState<Tutorial>({
    type: "youtube",
    url: "",
    title: "",
    credits: "",
    moreInfo: "",
  });

  const addTutorial = () => {
    if (newTutorial.url) {
      onChange([...tutorials, newTutorial]);
      setNewTutorial({
        type: "youtube",
        url: "",
        title: "",
        credits: "",
        moreInfo: "",
      });
    }
  };

  const removeTutorial = (index: number) => {
    onChange(tutorials.filter((_, i) => i !== index));
  };

  const updateTutorial = (index: number, updates: Partial<Tutorial>) => {
    const updated = [...tutorials];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Tutorials & Resources</h3>
        <p className="text-sm text-muted-foreground">
          Add video tutorials, articles, or additional learning resources.
        </p>
      </div>

      <div className="space-y-4">
        {tutorials.map((tutorial, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                    {tutorial.type === "youtube" ? <Video className="h-5 w-5 text-red-500" /> : <FileText className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={tutorial.type}
                            onValueChange={(value: any) => updateTutorial(index, { type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="youtube">YouTube Video</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input
                        value={tutorial.url}
                        onChange={(e) => updateTutorial(index, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Credits / Author</Label>
                    <Input
                      value={tutorial.credits || ""}
                      onChange={(e) => updateTutorial(index, { credits: e.target.value })}
                      placeholder="e.g., NeetCode, GeeksForGeeks"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>More Info (HTML supported)</Label>
                    <Textarea
                      value={tutorial.moreInfo || ""}
                      onChange={(e) => updateTutorial(index, { moreInfo: e.target.value })}
                      placeholder="<p>Detailed explanation...</p> or structured notes"
                      className="font-mono text-sm min-h-[150px]"
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTutorial(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Tutorial */}
        <Card className="border-dashed bg-muted/30">
            <CardHeader>
                <CardTitle className="text-base">Add New Resource</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={newTutorial.type}
                            onValueChange={(value: any) => setNewTutorial({ ...newTutorial, type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="youtube">YouTube Video</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                            value={newTutorial.url}
                            onChange={(e) => setNewTutorial({ ...newTutorial, url: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label>Credits / Author</Label>
                    <Input
                      value={newTutorial.credits || ""}
                      onChange={(e) => setNewTutorial({ ...newTutorial, credits: e.target.value })}
                      placeholder="e.g., NeetCode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>More Info (HTML supported)</Label>
                    <Textarea
                      value={newTutorial.moreInfo || ""}
                      onChange={(e) => setNewTutorial({ ...newTutorial, moreInfo: e.target.value })}
                      placeholder="<p>Detailed explanation...</p>"
                      className="font-mono text-sm"
                    />
                  </div>

              <Button onClick={addTutorial} disabled={!newTutorial.url} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
