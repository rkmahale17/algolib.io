'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const StackMaster = dynamic(() => import('@/pages/StackMaster'), { ssr: false });

export default function StackMasterClient() {
  return (
    <Suspense fallback={<div>Loading Stack Master...</div>}>
      <StackMaster />
    </Suspense>
  );
}
