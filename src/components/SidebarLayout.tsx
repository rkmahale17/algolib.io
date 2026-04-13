import { ReactNode } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Crown, MenuIcon, Rocket, Twitter } from "lucide-react";

import { Badge } from "./ui/badge";
import { useApp } from "@/contexts/AppContext";

interface SidebarLayoutProps {
    children: ReactNode;
}

import UserMenu from "./UserMenu";

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const location = useLocation();
    const isDsaRoute = location.pathname.startsWith('/dsa/');

    return (

        <SidebarInset>
            <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6 w-full sticky top-0 z-50 overflow-x-hidden">


                <div className="flex items-center gap-2">
                    {!isDsaRoute && <SidebarTrigger className="-ml-1" />}
                </div>


                <div className="flex-1 w-full flex justify-end items-center">
                    <div className="flex items-center gap-5">
                        {!isDsaRoute && (
                            <Link to="/get-started">
                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground px-2">
                                    <Rocket className="w-3.5 h-3.5" />
                                    <span>Get started</span>
                                </Button>
                            </Link>
                        )}

                        {isDsaRoute && (
                            <Link to="https://x.com/rulcode" target="_blank">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <Twitter className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}

                        <Link to="/pricing" className="text-[12px] font-normal text-muted-foreground hover:text-foreground transition-colors hidden md:block">

                            Pricing
                        </Link>

                        <ThemeToggle />

                        <UserMenu />
                    </div>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-[calc(100vh-48px)] min-w-0">
                {children}
            </div>
        </SidebarInset>
    );
}
