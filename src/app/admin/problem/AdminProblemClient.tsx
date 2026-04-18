'use client';
import dynamic from 'next/dynamic';
const AdminAlgorithmDetail = dynamic(() => import('@/pages/AdminAlgorithmDetail'), { ssr: false });
export default function AdminProblemClient() { return <AdminAlgorithmDetail />; }
