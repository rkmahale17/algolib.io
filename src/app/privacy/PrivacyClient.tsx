'use client';
import dynamic from 'next/dynamic';
const Privacy = dynamic(() => import('@/pages/Privacy'), { ssr: false });
export default function PrivacyClient() { return <Privacy />; }
