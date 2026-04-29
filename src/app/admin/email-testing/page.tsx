'use client';
import dynamic from 'next/dynamic';
import { ProtectedAdminRoute } from "@/admin/components/ProtectedAdminRoute";

const EmailTesting = dynamic(() => import('@/admin/pages/EmailTesting'), { ssr: false });

export default function AdminEmailTestingPage() {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <EmailTesting />
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
