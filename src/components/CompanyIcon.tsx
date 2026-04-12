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

  const compConfig = TOP_COMPANIES.find(
    (c) => c.name.toLowerCase() === company.toLowerCase() || c.id === company.toLowerCase()
  );

  const iconSlug = compConfig?.iconSlug || company.toLowerCase().replace(/\s+/g, '');
  const svglSlug = compConfig?.svglSlug || compConfig?.iconSlug || company.toLowerCase().replace(/\s+/g, '-');

  const localSrc = `/icons/companies/${iconSlug}.svg`;
  const svglSrc = `https://api.svgl.app/static/icons/${svglSlug}.svg`;
  const simpleiconSrc = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${iconSlug}.svg`;

  const [imgSrc, setImgSrc] = useState(localSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (forceLoad) return;
    
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 400); 

    return () => clearTimeout(timer);
  }, [forceLoad]);

  useEffect(() => {
    setImgSrc(localSrc);
    setHasError(false);
  }, [localSrc]);

  if (!shouldRender) {
    return <div className={cn("shrink-0 bg-muted/10 rounded-sm", className)} />;
  }

  return (
    <img
      src={imgSrc}
      alt={company}
      className={cn("object-contain dark:invert dark:hue-rotate-180 dark:brightness-[1.2]", className)}
      loading="lazy"
      onError={() => {
        if (imgSrc === localSrc) {
          // Fallback 1: svgl.app
          setImgSrc(svglSrc);
        } else if (imgSrc === svglSrc) {
          // Fallback 2: simpleicons
          setImgSrc(simpleiconSrc);
        } else {
          setHasError(true);
        }
      }}
      style={{ display: hasError ? 'none' : 'block' }}
    />
  );
};
