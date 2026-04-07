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

    const toggleMode = () => {
        if (currentMode === 'user') {
            navigate(`/admin/problem/${problemId}`);
        } else {
            navigate(`/problem/${problemId}`);
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
