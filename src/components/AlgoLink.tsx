import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlgoLinkProps {
  url: string;
  label?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  iconClassName?: string;
  hideIcon?: boolean;
}

export const AlgoLink: React.FC<AlgoLinkProps> = ({ 
  url, 
  label, 
  className, 
  children,
  iconClassName,
  hideIcon = false
}) => {
  const content = children || label || url;

  // Determine link type
  const isMail = url.startsWith('mailto:');
  const isHash = url.startsWith('#');
  const isExternal = url.startsWith('http') || url.startsWith('https') || url.startsWith('//');
  
  // Icon Size and Style
  const iconBaseClass = cn("inline-block ml-1.5 w-4 h-4", iconClassName);

  if (isMail) {
    return (
      <a 
        href={url} 
        className={cn("inline-flex items-center hover:underline text-primary", className)}
      >
        {content}
        {!hideIcon && <Mail className={iconBaseClass} />}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={cn("inline-flex items-center hover:underline text-primary", className)}
      >
        {content}
        {!hideIcon && <ExternalLink className={iconBaseClass} />}
      </a>
    );
  }

  if (isHash) {
    return (
      <a 
        href={url}
        className={cn("inline-flex items-center hover:underline text-primary", className)}
      >
        {content}
        {!hideIcon && <ArrowRight className={iconBaseClass} />}
      </a>
    );
  }

  // Internal Link
  return (
    <Link 
      to={url} 
      className={cn("inline-flex items-center hover:underline text-primary", className)}
    >
      {content}
      {!hideIcon && <ArrowRight className={iconBaseClass} />}
    </Link>
  );
};
