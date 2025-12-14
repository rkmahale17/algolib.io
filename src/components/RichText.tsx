import React, { useMemo } from 'react';
import parse, { DOMNode, Element, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { AlgoLink } from './AlgoLink';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface RichTextProps {
  content: string | string[];
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * RichText component for rendering HTML content from database
 * Supports images, formatting, and custom components like <AlgoLink>
 */
export const RichText: React.FC<RichTextProps> = ({ content, className = '', onClick }) => {
  // Handle case where content might be an array (legacy data support)
  const safeContent = useMemo(() => {
    let text = "";
    if (Array.isArray(content)) {
      text = content.join('');
    } else {
      text = content || '';
    }
    
    // Auto-fix: Convert JSX 'className' to HTML 'class' to support copy-pasting from React
    return text.replace(/\bclassName=(["'])/g, 'class=$1');
  }, [content]);

  const options: HTMLReactParserOptions = useMemo(() => ({
    replace: (domNode) => {
      // Check if it's an element
      if (domNode instanceof Element && domNode.attribs) {
        // Handle <AlgoLink> or <algolink> tags
        if (domNode.name === 'algolink') {
          const { url, label } = domNode.attribs;
          const children = domToReact(domNode.children as DOMNode[], options);
          return (
            <AlgoLink url={url} label={label}>
              {children}
            </AlgoLink>
          );
        }

        // Handle <ScrollArea> tags
        if (domNode.name === 'scrollarea') {
           const { class: className, ...rest } = domNode.attribs;
           const children = domToReact(domNode.children as DOMNode[], options);
           return (
             <ScrollArea className={className} {...rest}>
               {children}
             </ScrollArea>
           );
        }
        
        // Handle <ScrollBar> tags
        if (domNode.name === 'scrollbar') {
           const { class: className, orientation, ...rest } = domNode.attribs;
           return (
             <ScrollBar 
                className={className} 
                orientation={orientation as "horizontal" | "vertical"} 
                {...rest} 
             />
           );
        }
      }
    }
  }), []);

  // Parse only when content changes
  const parsedContent = useMemo(() => parse(safeContent, options), [safeContent, options]);

  // Heuristic: If content doesn't look like HTML (no tags), preserve whitespace/newlines
  const isHtml = /<[a-z][\s\S]*>/i.test(safeContent);
  const whitespaceClass = isHtml ? '' : 'whitespace-pre-wrap';

  return (
    <ScrollArea className="w-full max-w-full">
      <div
        className={`prose prose-sm max-w-none dark:prose-invert ${whitespaceClass} ${className}`}
        onClick={onClick}
        style={{
          // Ensure images are responsive
          '--tw-prose-body': 'inherit',
        } as React.CSSProperties}
      >
        {parsedContent}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
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
