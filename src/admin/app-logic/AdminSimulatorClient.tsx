'use client';
import dynamic from 'next/dynamic';
const AdminSimulator = dynamic(() => import('@/admin/pages/AdminSimulator'), { ssr: false });
export default function AdminSimulatorClient() { return <AdminSimulator />; }
