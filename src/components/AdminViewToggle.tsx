import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Layout, Edit3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminViewToggle = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id, slug } = useParams();
    const { user } = useApp();

    const adminId = import.meta.env.VITE_ADMIN_USER_ID;
    const isAdmin = adminId && user?.id === adminId;

    // We only show this toggle on problem detail pages or admin problem detail pages
    const isProblemPage = location.pathname.startsWith('/problem/');
    const isAdminProblemPage = location.pathname.startsWith('/admin/problem/');

    if (!isAdmin || (!isProblemPage && !isAdminProblemPage)) {
        return null;
    }

    const problemId = id || slug || location.pathname.split('/').pop();
    if (!problemId || problemId === 'new') return null;

    const currentMode = isAdminProblemPage ? 'admin' : 'user';

    const toggleMode = (mode: 'admin' | 'user') => {
        if (mode === currentMode) return;

        if (mode === 'admin') {
            navigate(`/admin/problem/${problemId}`);
        } else {
            navigate(`/problem/${problemId}`);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/4 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-2xl">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMode('user')}
                    className={cn(
                        "rounded-full px-4 py-1.5 h-auto gap-2 transition-all",
                        currentMode === 'user'
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold">User View</span>
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMode('admin')}
                    className={cn(
                        "rounded-full px-4 py-1.5 h-auto gap-2 transition-all",
                        currentMode === 'admin'
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                >
                    <Edit3 className="w-4 h-4" />
                    <span className="text-xs font-semibold">Admin View</span>
                </Button>
            </div>
        </div>
    );
};

export default AdminViewToggle;
