'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const DPPuzzle = dynamic(() => import('@/pages/DPPuzzle'), { ssr: false });

export default function DPPuzzleClient() {
  return (
    <Suspense fallback={<div>Loading DP Puzzle...</div>}>
      <DPPuzzle />
    </Suspense>
  );
}
