'use client';

import { ProtectedAdminRoute } from "@/admin/components/ProtectedAdminRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}
