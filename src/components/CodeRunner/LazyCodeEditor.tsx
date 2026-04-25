import React, { forwardRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CodeEditorRef } from './CodeEditor';
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(
  () => import('./CodeEditor').then((mod) => mod.CodeEditor),
  { ssr: false, loading: () => <CodeEditorSkeleton /> }
);

export const CodeEditorSkeleton = () => (
  <div className="h-full w-full bg-background p-4 space-y-3">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/3" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-2/5" />
  </div>
);

interface LazyCodeEditorProps {
  language: string;
  code: string;
  onChange: (value: string | undefined) => void;
  options?: Record<string, any>;
  theme?: string;
  path?: string;
  isMobile?: boolean;
  onShortcut?: (key: string) => void;
}

export const LazyCodeEditor = forwardRef<CodeEditorRef, LazyCodeEditorProps>(
  (props, ref) => <CodeEditor ref={ref as any} {...props} />
);

LazyCodeEditor.displayName = 'LazyCodeEditor';
