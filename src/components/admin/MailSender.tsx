import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { Send, Mail } from "lucide-react";

export function MailSender() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const handleSend = async (isTest: boolean) => {
    if (!subject || !content) {
      toast({
        title: "Missing fields",
        description: "Subject and Content are required.",
        variant: "destructive",
      });
      return;
    }

    if (isTest && !testEmail) {
      toast({
        title: "Missing test email",
        description: "Please enter an email address for testing.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // The function expects a JSON body, not a 'body' property with the JSON inside
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          subject,
          content,
          ctaText: ctaText || undefined,
          ctaUrl: ctaUrl || undefined,
          testEmail: isTest ? testEmail : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: isTest ? "Test email sent" : "Bulk email sent",
        description: isTest 
          ? `Test email sent to ${testEmail}` 
          : `Processed ${data.total} emails. Success: ${data.successful}, Failed: ${data.failed}`,
        variant: isTest ? "default" : "default",
      });

    } catch (error: any) {
      console.error("Error invoking function:", error);
      toast({
        title: "Error sending email",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </CardTitle>
          <CardDescription>
            Create a new email broadcast to all users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Email Subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (supports newlines)</Label>
            <Textarea 
              id="content" 
              placeholder="Enter your email content here..." 
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text (Optional)</Label>
              <Input 
                id="ctaText" 
                placeholder="e.g. Read More" 
                value={ctaText} 
                onChange={(e) => setCtaText(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaUrl">CTA Button URL (Optional)</Label>
              <Input 
                id="ctaUrl" 
                placeholder="e.g. https://rulcode.com/blog" 
                value={ctaUrl} 
                onChange={(e) => setCtaUrl(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test & Send</CardTitle>
          <CardDescription>
            Always send a test email to yourself before broadcasting to all users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="testEmail">Test Email Address</Label>
                    <Input 
                        id="testEmail" 
                        placeholder="your@email.com" 
                        value={testEmail} 
                        onChange={(e) => setTestEmail(e.target.value)} 
                    />
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => handleSend(true)}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Test Email"}
                </Button>
            </div>

            <div className="pt-4 border-t mt-4">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full" variant="destructive" disabled={loading}>
                            <Send className="mr-2 h-4 w-4" />
                            Broadcast to All Users
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will send an email to ALL registered users.
                                Please ensure you have tested the email content first.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleSend(false)}>
                                Yes, Send Broadcast
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
