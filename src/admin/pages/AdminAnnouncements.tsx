"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { GlobalPromoBanner } from "@/components/GlobalPromoBanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Announcement = {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  type?: string;
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewAnnouncement, setPreviewAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image_url: "",
    is_active: false,
    type: "toast", // default
    hasCopyCode: false,
    discountCode: "",
    hasTimer: false,
    endDate: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch announcements");
    } else if (data) {
      setAnnouncements(data);
    }
    setLoading(false);
  };

  const handleOpenDialog = (announcement?: Announcement) => {
    if (announcement) {
      let hasCopyCode = false;
      let discountCode = "";
      let hasTimer = false;
      let endDate = "";
      let image_url = announcement.image_url || "";

      if (announcement.type === "header" && image_url.startsWith("{")) {
        try {
          const meta = JSON.parse(image_url);
          hasCopyCode = meta.hasCopyCode || false;
          discountCode = meta.discountCode || "";
          hasTimer = meta.hasTimer || false;
          endDate = meta.endDate || "";
        } catch (e) {}
      }

      setEditingId(announcement.id);
      setFormData({
        title: announcement.title,
        body: announcement.body,
        image_url: announcement.type === "toast" ? image_url : "",
        is_active: announcement.is_active,
        type: announcement.type || "toast",
        hasCopyCode,
        discountCode,
        hasTimer,
        endDate,
      });
    } else {
      setEditingId(null);
      setFormData({ 
        title: "", 
        body: "", 
        image_url: "", 
        is_active: false, 
        type: "toast",
        hasCopyCode: false,
        discountCode: "",
        hasTimer: false,
        endDate: "", 
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = formData.image_url;
    if (formData.type === "header") {
      finalImageUrl = JSON.stringify({
        hasCopyCode: formData.hasCopyCode,
        discountCode: formData.discountCode,
        hasTimer: formData.hasTimer,
        endDate: formData.endDate,
      });
    }

    const payload = {
      title: formData.title,
      body: formData.body,
      is_active: formData.is_active,
      type: formData.type,
      image_url: finalImageUrl,
    };

    if (editingId) {
      const { error } = await supabase
        .from("announcements")
        .update(payload)
        .eq("id", editingId);
      if (error) {
        toast.error("Failed to update announcement");
      } else {
        toast.success("Announcement updated");
        setIsDialogOpen(false);
        fetchAnnouncements();
      }
    } else {
      const { error } = await supabase
        .from("announcements")
        .insert([payload]);
      if (error) {
        toast.error("Failed to create announcement");
      } else {
        toast.success("Announcement created");
        setIsDialogOpen(false);
        fetchAnnouncements();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete announcement");
      } else {
        toast.success("Announcement deleted");
        fetchAnnouncements();
      }
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("announcements")
      .update({ is_active: !currentActive })
      .eq("id", id);
    if (error) {
      toast.error("Failed to toggle status");
    } else {
      toast.success(`Announcement ${!currentActive ? 'activated' : 'deactivated'}`);
      fetchAnnouncements();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Manage global announcements shown to all users.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" /> New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="toast">Toast Notification (Bottom Left)</option>
                  <option value="header">Global Header Banner (Top)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title (HTML/Text)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body (HTML/Text)</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              {formData.type === "header" && (
                <>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="hasCopyCode"
                      checked={formData.hasCopyCode}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasCopyCode: checked })
                      }
                    />
                    <Label htmlFor="hasCopyCode">Show Copy Code Button</Label>
                  </div>
                  {formData.hasCopyCode && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="discountCode">Discount Code</Label>
                      <Input
                        id="discountCode"
                        value={formData.discountCode}
                        onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                        placeholder="e.g. INDEPENDENCE"
                        required={formData.hasCopyCode}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="hasTimer"
                      checked={formData.hasTimer}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasTimer: checked })
                      }
                    />
                    <Label htmlFor="hasTimer">Show Countdown Timer</Label>
                  </div>
                  {formData.hasTimer && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required={formData.hasTimer}
                      />
                    </div>
                  )}
                </>
              )}
              {formData.type === "toast" && (
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.png"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="active">Active</Label>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-white/10 bg-black/20">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading announcements...
                </TableCell>
              </TableRow>
            ) : announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No announcements found.
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((ann) => (
                <TableRow key={ann.id} className="border-white/10">
                  <TableCell className="font-medium">{ann.title}</TableCell>
                  <TableCell>
                    <Switch
                      checked={ann.is_active}
                      onCheckedChange={() => toggleActive(ann.id, ann.is_active)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewAnnouncement(ann)}
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(ann)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(ann.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewAnnouncement} onOpenChange={(open) => !open && setPreviewAnnouncement(null)}>
        <DialogContent className={previewAnnouncement?.type === 'header' ? "max-w-full p-0 bg-transparent border-none shadow-none mt-20" : "sm:max-w-md flex flex-col items-center justify-center p-8 bg-transparent border-none shadow-none [&>button]:hidden"}>
          <DialogHeader className="sr-only">
            <DialogTitle>Preview Announcement</DialogTitle>
          </DialogHeader>
          {previewAnnouncement && (
            <div className="relative w-full flex justify-center">
              {previewAnnouncement.type === 'header' ? (
                <div className="w-full relative">
                  {/* Import GlobalPromoBanner at the top of the file if not already imported */}
                  <GlobalPromoBanner announcement={previewAnnouncement} />
                </div>
              ) : (
                <AnnouncementBanner
                  announcement={{
                    ...previewAnnouncement,
                    updated_at: new Date().toISOString()
                  }}
                  onDismiss={() => setPreviewAnnouncement(null)}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
