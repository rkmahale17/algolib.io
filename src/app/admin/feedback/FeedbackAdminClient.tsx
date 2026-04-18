'use client';
import dynamic from 'next/dynamic';
const FeedbackAdmin = dynamic(() => import('@/pages/FeedbackAdmin'), { ssr: false });
export default function FeedbackAdminClient() { return <FeedbackAdmin />; }
