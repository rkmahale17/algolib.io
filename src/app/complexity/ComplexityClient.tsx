'use client';
import dynamic from 'next/dynamic';
const TimeComplexity = dynamic(() => import('@/pages/TimeComplexity'), { ssr: false });
export default function ComplexityClient() { return <TimeComplexity />; }
