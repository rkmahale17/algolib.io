"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function EmailTesting() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("welcome");
  const [loading, setLoading] = useState(false);

  const handleTestEmail = async () => {
    if (!email) {
      toast.error("Please enter a test email address");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const payload: any = {
        user: { email },
      };

      if (type === "welcome") {
        payload.action_type = "signup";
        payload.email_data = {
          token_hash: "test_token_hash",
          redirect_to: "https://rulcode.com",
          email_action_type: "signup"
        };
      } else if (type === "pro_activated") {
        payload.action_type = "subscription";
        payload.subscription_data = {
          action_type: "active",
        };
      } else if (type === "subscription_cancelled") {
        payload.action_type = "subscription";
        payload.subscription_data = {
          action_type: "cancelled",
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      } else if (type === "login") {
        payload.action_type = "magiclink";
        payload.email_data = {
          token: "123456",
          token_hash: "test_magic_link_hash",
          redirect_to: "https://rulcode.com",
          email_action_type: "magiclink"
        };
      }

      const { data, error } = await supabase.functions.invoke("send-email", {
        body: payload,
      });

      if (error) throw error;

      toast.success(`Test email sent to ${email}!`);
    } catch (err: any) {
      console.error("Email test error:", err);
      toast.error(err.message || "Failed to send test email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Email Testing</h1>
        <p className="text-muted-foreground mt-2">
          Trigger test emails to verify branding and template consistency.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Test Email
            </CardTitle>
            <CardDescription>
              This will trigger a real email via Resend using our React Email templates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Test Recipient</Label>
              <Input 
                id="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Email Template</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome / Confirmation</SelectItem>
                  <SelectItem value="pro_activated">Subscription Activated (Pro)</SelectItem>
                  <SelectItem value="subscription_cancelled">Subscription Cancelled</SelectItem>
                  <SelectItem value="login">Login / Magic Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full" 
              onClick={handleTestEmail} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p>Verify that all links in the email point to the correct environment (localhost vs production).</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p>Check both Desktop and Mobile views for layout responsiveness.</p>
            </div>
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p>The "Login" test will show a 6-digit code (123456) and a mock magic link.</p>
            </div>
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p>Subscription emails will use dummy data for trial ends or cancellation dates.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
