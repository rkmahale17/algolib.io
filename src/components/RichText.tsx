import React, { useMemo } from 'react';
import parse, { DOMNode, Element, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { AlgoLink } from './AlgoLink';

interface RichTextProps {
  content: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * RichText component for rendering HTML content from database
 * Supports images, formatting, and custom components like <AlgoLink>
 */
export const RichText: React.FC<RichTextProps> = ({ content, className = '', onClick }) => {
  
  const options: HTMLReactParserOptions = useMemo(() => ({
    replace: (domNode) => {
      // Check if it's an element
      if (domNode instanceof Element && domNode.attribs) {
        // Handle <AlgoLink> or <algolink> tags
        // Note: html-react-parser lowercases tag names
        if (domNode.name === 'algolink') {
          const { url, label } = domNode.attribs;
          // Render children if present, otherwise use label attrib
          const children = domToReact(domNode.children as DOMNode[], options);
          
          return (
            <AlgoLink url={url} label={label}>
              {children}
            </AlgoLink>
          );
        }
      }
    }
  }), []);

  // Parse only when content changes
  const parsedContent = useMemo(() => parse(content, options), [content, options]);

  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert ${className}`}
      onClick={onClick}
      style={{
        // Ensure images are responsive
        '--tw-prose-body': 'inherit',
      } as React.CSSProperties}
    >
      {parsedContent}
    </div>
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
