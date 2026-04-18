'use client';
import dynamic from 'next/dynamic';
const AdminAlgorithms = dynamic(() => import('@/pages/AdminAlgorithms'), { ssr: false });
export default function AdminAlgorithmsClient() { return <AdminAlgorithms />; }
