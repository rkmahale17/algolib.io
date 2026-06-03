"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LogOut,
    MessageSquare,
    ShieldCheck,
    User,
    CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import { FeatureGuard } from "./FeatureGuard";

const UserMenu = () => {
    const router = useRouter();
    const { user, profile } = useApp();
    const isAdmin = profile?.role === 'admin';

    const handleSignOut = async () => {
        if (!supabase) {
            toast.error("Authentication not available");
            return;
        }
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to sign out");
        } else {
            toast.success("Signed out successfully");
            router.refresh();
            router.push("/");
        }
    };

    if (!user) {
        return (
            <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 px-4 font-medium transition-colors">
                    Sign In
                </Button>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="relative h-8 w-8 rounded-full border border-border/60 bg-background/50 p-0 overflow-hidden flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url || undefined} alt={profile?.full_name || user?.user_metadata?.full_name || "User"} className="object-cover" />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                                <User className="h-3.5 w-3.5" />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {user.user_metadata?.full_name || "User"}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground truncate max-w-full">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <FeatureGuard flag="profiles">
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                                href={profile?.username ? `/profile/${profile.username}` : "/profile"}
                                className="w-full flex items-center"
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/pricing" className="w-full flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </Link>
                        </DropdownMenuItem>
                    </FeatureGuard>

                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/feedback" className="w-full flex items-center">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>Feedback</span>
                        </Link>
                    </DropdownMenuItem>

                    {isAdmin && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/admin" className="w-full flex items-center">
                                <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">Admin Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserMenu;

