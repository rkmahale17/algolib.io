'use client';
import dynamic from 'next/dynamic';
const AdminTaggingUpdate = dynamic(() => import('@/pages/AdminTaggingUpdate'), { ssr: false });
export default function AdminTaggingClient() { return <AdminTaggingUpdate />; }
