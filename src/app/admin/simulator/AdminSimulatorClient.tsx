'use client';
import dynamic from 'next/dynamic';
const AdminSimulator = dynamic(() => import('@/pages/AdminSimulator'), { ssr: false });
export default function AdminSimulatorClient() { return <AdminSimulator />; }
