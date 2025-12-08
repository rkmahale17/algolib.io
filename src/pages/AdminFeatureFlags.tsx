import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FeatureFlag } from "@/types/featureFlags";
import { toast } from "sonner";
import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

export default function AdminFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFlagKey, setNewFlagKey] = useState("");
  const [newFlagDesc, setNewFlagDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      // @ts-ignore
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      toast.error("Failed to load feature flags");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flag: FeatureFlag) => {
    // Optimistic update
    const originalFlags = [...flags];
    setFlags(flags.map(f => f.id === flag.id ? { ...f, is_enabled: !f.is_enabled } : f));

    try {
      // @ts-ignore
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: !flag.is_enabled })
        .eq('id', flag.id);

      if (error) {
        throw error;
      }
      toast.success(`${flag.key} is now ${!flag.is_enabled ? 'Enabled' : 'Disabled'}`);
    } catch (error) {
      setFlags(originalFlags); // Revert
      toast.error("Failed to update flag");
      console.error(error);
    }
  };

  const createFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagKey) return;
    setCreating(true);

    try {
      // @ts-ignore
      const { error } = await supabase
        .from('feature_flags')
        .insert([{ 
            key: newFlagKey.toLowerCase().replace(/\s+/g, '_'), 
            description: newFlagDesc,
            is_enabled: false 
        }]);

      if (error) throw error;
      
      toast.success("Feature flag created");
      setNewFlagKey("");
      setNewFlagDesc("");
      fetchFlags();
    } catch (error) {
      toast.error("Failed to create flag");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const deleteFlag = async (id: string) => {
    if (!confirm("Are you sure? This might break the app if the code relies on this flag.")) return;

    try {
        // @ts-ignore
        const { error } = await supabase.from('feature_flags').delete().eq('id', id);
        if (error) throw error;
        toast.success("Flag deleted");
        setFlags(flags.filter(f => f.id !== id));
    } catch (error) {
        toast.error("Failed to delete flag");
        console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Feature Flags</h1>
            <p className="text-muted-foreground">Manage real-time feature toggles for the application.</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchFlags} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create New Flag */}
        <Card className="lg:col-span-1 h-fit">
            <CardHeader>
                <CardTitle>Add New Flag</CardTitle>
                <CardDescription>Define a new meaningful key.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={createFlag} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="key">Key (snake_case)</Label>
                        <Input 
                            id="key" 
                            placeholder="new_profile_page" 
                            value={newFlagKey}
                            onChange={e => setNewFlagKey(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="desc">Description</Label>
                        <Input 
                            id="desc" 
                            placeholder="Enables the new profile UI" 
                            value={newFlagDesc}
                            onChange={e => setNewFlagDesc(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating || !newFlagKey}>
                        {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Flag
                    </Button>
                </form>
            </CardContent>
        </Card>

        {/* List Flags */}
        <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle>Active Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {flags.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        No feature flags defined.
                    </div>
                ) : (
                    flags.map((flag) => (
                        <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-semibold">{flag.key}</span>
                                    {flag.is_enabled ? (
                                        <Badge className="bg-green-500 hover:bg-green-600">Enabled</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">{flag.description || "No description provided."}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Switch 
                                    checked={flag.is_enabled}
                                    onCheckedChange={() => toggleFlag(flag)}
                                />
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteFlag(flag.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
