'use client';
import dynamic from 'next/dynamic';
const AdminTaggingUpdate = dynamic(() => import('@/admin/pages/AdminTaggingUpdate'), { ssr: false });
export default function AdminTaggingClient() { return <AdminTaggingUpdate />; }
