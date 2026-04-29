'use client';
import dynamic from 'next/dynamic';
const AdminFeatureFlags = dynamic(() => import('@/admin/pages/AdminFeatureFlags'), { ssr: false });
export default function AdminFeaturesClient() { return <AdminFeatureFlags />; }
