"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeedbackButton() {
  const pathname = usePathname();

  // Hide on problem pages as per request
  if (pathname?.startsWith("/problem/") || pathname?.startsWith("/pattern-guess/")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-background/90 backdrop-blur-md border-border/60 hover:bg-accent hover:border-border transition-all duration-300 hover:scale-110 active:scale-95 px-4 h-11"
      >
        <a
          href="https://github.com/rkmahale17/rulcode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5"
          onClick={() => window.open("/feedback", "_blank")}
        >
          <div className="bg-primary/10 p-1.5 rounded-full">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm tracking-tight pr-1">Feedback</span>
        </a>
      </Button>
    </div>
  );
}
