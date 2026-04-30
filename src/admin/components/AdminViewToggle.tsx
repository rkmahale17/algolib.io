import React from 'react';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Layout, Edit3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminViewToggle = () => {
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();
    const { id, slug } = params as { id?: string; slug?: string };
    const { user, profile } = useApp();

    const isAdmin = profile?.role === 'admin';

    // We only show this toggle on problem detail pages or admin problem detail pages
    const isProblemPage = pathname.startsWith('/problem/');
    const isAdminProblemPage = pathname.startsWith('/admin/problem/');

    if (!isAdmin || (!isProblemPage && !isAdminProblemPage)) {
        return null;
    }

    const problemId = id || slug || pathname.split('/').pop();
    if (!problemId || problemId === 'new') return null;

    const currentMode = isAdminProblemPage ? 'admin' : 'user';

    const toggleMode = () => {
        if (currentMode === 'user') {
            router.push(`/admin/problem/${problemId}`);
        } else {
            router.push(`/problem/${problemId}`);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Button
                variant="outline"
                size="icon"
                onClick={toggleMode}
                className="w-10 h-10 rounded-full shadow-2xl bg-background/80 backdrop-blur-md border border-border hover:bg-accent transition-all"
                title={currentMode === 'user' ? "Switch to Admin View" : "Switch to User View"}
            >
                {currentMode === 'user' ? (
                    <Edit3 className="w-4 h-4 text-primary" />
                ) : (
                    <User className="w-4 h-4 text-primary" />
                )}
            </Button>
        </div>
    );
};

export default AdminViewToggle;
