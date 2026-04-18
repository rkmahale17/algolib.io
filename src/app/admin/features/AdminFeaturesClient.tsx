'use client';
import dynamic from 'next/dynamic';
const AdminFeatureFlags = dynamic(() => import('@/pages/AdminFeatureFlags'), { ssr: false });
export default function AdminFeaturesClient() { return <AdminFeatureFlags />; }
