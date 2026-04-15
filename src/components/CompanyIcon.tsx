import React, { useState, useEffect } from 'react';
import { TOP_COMPANIES } from '@/constants/companies';
import { cn } from '@/lib/utils';

interface CompanyIconProps {
  company: string;
  className?: string;
  forceLoad?: boolean;
}

/**
 * CompanyIcon component that loads brand icons locally.
 * Implements deferred loading to ensure icons do not affect initial page load times.
 */
export const CompanyIcon: React.FC<CompanyIconProps> = ({ company, className, forceLoad = false }) => {
  const [shouldRender, setShouldRender] = useState(forceLoad);

  const compConfig = TOP_COMPANIES.find(
    (c) => c.name.toLowerCase() === company.toLowerCase() || c.id === company.toLowerCase()
  );

  const iconSlug = compConfig?.iconSlug || company.toLowerCase().replace(/\s+/g, '');
  const localSrc = `/icons/companies/${iconSlug}.svg`;

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (forceLoad) return;
    
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 400); 

    return () => clearTimeout(timer);
  }, [forceLoad]);

  useEffect(() => {
    setHasError(false);
  }, [localSrc]);

  if (!shouldRender) {
    return <div className={cn("shrink-0 bg-muted/10 rounded-sm", className)} />;
  }

  if (hasError) return null;

  return (
    <img
      src={localSrc}
      alt={company}
      className={cn("object-contain dark:invert dark:hue-rotate-180 dark:brightness-[1.2]", className)}
      loading="lazy"
      onError={() => {
        setHasError(true);
      }}
      style={{ display: hasError ? 'none' : 'block' }}
    />
  );
};
