import { MailSender } from "@/components/admin/MailSender";

export default function AdminMail() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Email Management</h1>
        <p className="text-muted-foreground">
          Send broadcast emails to all users or test emails to yourself.
        </p>
      </div>
      <MailSender />
    </div>
  );
}
