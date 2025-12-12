import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const WhiteboardComponent = React.lazy(() =>
  import('./WhiteboardComponent').then((mod) => ({ default: mod.WhiteboardComponent }))
);

const WhiteboardSkeleton = () => (
  <div className="h-[700px] w-full bg-background rounded-lg border border-border p-4">
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
    <Skeleton className="h-[calc(100%-88px)] w-full rounded-lg" />
  </div>
);

interface LazyWhiteboardComponentProps {
  algorithmId: string;
  algorithmTitle: string;
  restoreData?: { id: string; board_json: any } | null;
  isExpand?: boolean;
}

export const LazyWhiteboardComponent: React.FC<LazyWhiteboardComponentProps> = (props) => (
  <Suspense fallback={<WhiteboardSkeleton />}>
    <WhiteboardComponent {...props} />
  </Suspense>
);
