import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { usePostHog } from '@posthog/react';

interface CopyCodeButtonProps {
  code: string;
  language?: string;
}

export function CopyCodeButton({ code, language }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const posthog = usePostHog();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      posthog?.capture('algorithm_code_copied', { language });
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
}
