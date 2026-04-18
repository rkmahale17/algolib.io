'use client';
import dynamic from 'next/dynamic';
const CompilerDocs = dynamic(() => import('@/pages/CompilerDocs'), { ssr: false });
export default function DocsClient() { return <CompilerDocs />; }
