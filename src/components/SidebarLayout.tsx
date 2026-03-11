import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Crown, MenuIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useApp } from "@/contexts/AppContext";

interface SidebarLayoutProps {
    children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const [user, setUser] = useState<any>(null);
    const { profile } = useApp();

    useEffect(() => {
        if (!supabase) return;

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <SidebarInset>
            <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6 w-full sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                </div>

                <div className="flex-1 w-full flex justify-end items-center">
                    <div className="flex items-center gap-5">
                        <Badge variant="secondary" className="hidden md:flex bg-muted/50 hover:bg-muted text-foreground border-transparent text-[11px] h-[26px] py-0 px-3 font-normal cursor-pointer gap-2 items-center">
                            <span className="bg-[#E5FF7F] text-black px-1.5 py-[1px] rounded-[3px] font-medium text-[9px] uppercase tracking-wider">New</span>
                            <span>Advertise with us &rarr;</span>
                        </Badge>

                        {user ? (
                            <div className="ml-1 flex items-center">
                                <Avatar className="h-[28px] w-[28px] border border-border cursor-pointer">
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                                        {user.email?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-x-hidden min-h-[calc(100vh-48px)]">
                {children}
            </div>
        </SidebarInset>
    );
}
