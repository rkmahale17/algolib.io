import React from 'react';

interface RichTextProps {
  content: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * RichText component for rendering HTML content from database
 * Supports images, formatting, and all HTML elements
 */
export const RichText: React.FC<RichTextProps> = ({ content, className = '', onClick }) => {
  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
      onClick={onClick}
      style={{
        // Ensure images are responsive
        '--tw-prose-body': 'inherit',
      } as React.CSSProperties}
    />
  );
};

/**
 * CSS for prose styling (add to your global CSS if needed):
 * 
 * .prose img {
 *   max-width: 100%;
 *   height: auto;
 *   border-radius: 0.5rem;
 *   margin: 1rem 0;
 * }
 * 
 * .prose pre {
 *   background-color: #1e1e1e;
 *   padding: 1rem;
 *   border-radius: 0.5rem;
 *   overflow-x: auto;
 * }
 * 
 * .prose code {
 *   background-color: rgba(0, 0, 0, 0.1);
 *   padding: 0.2rem 0.4rem;
 *   border-radius: 0.25rem;
 *   font-size: 0.875em;
 * }
 */
