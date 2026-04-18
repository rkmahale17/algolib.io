'use client';
import dynamic from 'next/dynamic';
const AdminMail = dynamic(() => import('@/pages/AdminMail'), { ssr: false });
export default function AdminMailClient() { return <AdminMail />; }
