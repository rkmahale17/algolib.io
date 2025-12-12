import React, { Suspense, forwardRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CodeEditorRef } from './CodeEditor';

const CodeEditor = React.lazy(() =>
  import('./CodeEditor').then((mod) => ({ default: mod.CodeEditor }))
);

const CodeEditorSkeleton = () => (
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
}

export const LazyCodeEditor = forwardRef<CodeEditorRef, LazyCodeEditorProps>(
  (props, ref) => (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <CodeEditor ref={ref} {...props} />
    </Suspense>
  )
);

LazyCodeEditor.displayName = 'LazyCodeEditor';
