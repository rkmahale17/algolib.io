'use client';

/**
 * SidebarController.tsx
 *
 * Lightweight component that reacts to pathname changes and opens or closes
 * the sidebar accordingly. By isolating `usePathname()` here (instead of in
 * the top-level Providers), only this tiny component re-renders on navigation
 * — the rest of the provider tree stays stable.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { isSidebarRoute } from '@/config/sidebarNav';

export default function SidebarController(): null {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const prevShouldOpen = useRef<boolean | null>(null);

  useEffect(() => {
    const shouldOpen = isSidebarRoute(pathname);

    // Only call setOpen when the route category actually changes (sidebar ↔ non-sidebar)
    // to avoid closing/opening on every navigation within the same section.
    if (prevShouldOpen.current !== shouldOpen) {
      setOpen(shouldOpen);
      prevShouldOpen.current = shouldOpen;
    }
  }, [pathname, setOpen]);

  return null;
}
