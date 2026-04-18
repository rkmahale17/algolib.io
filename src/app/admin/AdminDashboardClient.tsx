'use client';
import dynamic from 'next/dynamic';
const AdminDashboard = dynamic(() => import('@/pages/AdminDashboard'), { ssr: false });
export default function AdminDashboardClient() { return <AdminDashboard />; }
