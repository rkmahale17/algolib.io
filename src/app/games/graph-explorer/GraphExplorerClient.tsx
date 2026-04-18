'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const GraphExplorer = dynamic(() => import('@/pages/GraphExplorer'), { ssr: false });

export default function GraphExplorerClient() {
  return (
    <Suspense fallback={<div>Loading Graph Explorer...</div>}>
      <GraphExplorer />
    </Suspense>
  );
}
