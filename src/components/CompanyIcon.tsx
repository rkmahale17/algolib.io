import React, { useState, useEffect } from 'react';
import { TOP_COMPANIES } from '@/constants/companies';
import { cn } from '@/lib/utils';

interface CompanyIconProps {
  company: string;
  className?: string;
  forceLoad?: boolean;
}

/**
 * CompanyIcon component that loads brand icons from svgl.app with a fallback to simpleicons.org.
 * Implements deferred loading to ensure icons do not affect initial page load times.
 */
export const CompanyIcon: React.FC<CompanyIconProps> = ({ company, className, forceLoad = false }) => {
  const [shouldRender, setShouldRender] = useState(forceLoad);

  useEffect(() => {
    if (forceLoad) return;
    
    // Defer loading to ensure it doesn't block initial page render or data fetching.
    // This addresses the requirement that icons should load after algorithm fetch.
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 400); 

    return () => clearTimeout(timer);
  }, [forceLoad]);

  if (!shouldRender) {
    return <div className={cn("shrink-0 bg-muted/10 rounded-sm", className)} />;
  }

  const compConfig = TOP_COMPANIES.find(
    (c) => c.name.toLowerCase() === company.toLowerCase() || c.id === company.toLowerCase()
  );

  const svglSlug = compConfig?.svglSlug || compConfig?.iconSlug || company.toLowerCase().replace(/\s+/g, '-');
  const simpleiconSlug = compConfig?.iconSlug || company.toLowerCase().replace(/\s+/g, '');

  const svglSrc = `https://api.svgl.app/static/icons/${svglSlug}.svg`;
  const simpleiconSrc = `https://cdn.simpleicons.org/${simpleiconSlug}`;

  return (
    <img
      src={svglSrc}
      alt={company}
      className={cn("object-contain", className)}
      loading="lazy"
      onError={(e) => {
        // Fallback to simpleicons if svgl fails
        const img = e.target as HTMLImageElement;
        if (img.src !== simpleiconSrc) {
          img.src = simpleiconSrc;
        }
      }}
    />
  );
};
