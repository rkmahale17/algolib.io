'use client';
import dynamic from 'next/dynamic';
const Terms = dynamic(() => import('@/pages/TermsOfService'), { ssr: false });
export default function TermsClient() { return <Terms />; }
