import React, { useMemo } from 'react';
import parse, { DOMNode, Element, domToReact, HTMLReactParserOptions } from 'html-react-parser';
import { AlgoLink } from './AlgoLink';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ResponsiveTableContainer } from './ResponsiveTableContainer';
import { Tips } from '@/components/ui/Tips';
import { Skeleton } from "@/components/ui/skeleton";

interface RichTextProps {
  content: string | string[];
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Image wrapper with skeleton loading state
 */
const ImageWithSkeleton = ({ src, alt, className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className="relative w-full my-4">
      {!loaded && !error && (
        <Skeleton className="w-full aspect-video rounded-lg animate-pulse bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
        {...props}
      />
      {error && (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground italic">
          Failed to load image
        </div>
      )}
    </div>
  );
};

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
    text = text.replace(/\bclassName=(["'])/g, 'class=$1');

    // Auto-fix: Remove document-level tags (html, head, body) that cause React nesting warnings
    // We strip the tags but keep their inner content
    text = text.replace(/<\/?(html|head|body)[\s\S]*?>/gi, '');

    // Auto-fix: Escape non-HTML angle brackets like <number> or <T>
    // We only want to keep legitimate HTML tags and our custom components.
    // This prevents 'Invalid tag' errors during prerendering when algorithm descriptions
    // contain mathematical or type notation.
    text = text.replace(/<(?!(\/?(a|p|br|hr|h[1-6]|div|span|ul|ol|li|blockquote|code|pre|img|table|thead|tbody|tr|th|td|strong|em|b|i|u|mark|svg|path|algolink|scrollarea|scrollbar|tips)(\b|>)))/gi, '&lt;');

    return text;
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

        // Handle <Tips> or <tips> tags
        if (domNode.name === 'tips') {
          const { heading } = domNode.attribs;
          const children = domToReact(domNode.children as DOMNode[], options);
          return (
            <Tips heading={heading}>
              {children}
            </Tips>
          );
        }

        // Handle <table> tags to automatically wrap them in responsive container
        if (domNode.name === 'table') {
          const { class: className, style: _style, ...rest } = domNode.attribs;
          const children = domToReact(domNode.children as DOMNode[], options);

          const combinedClass = (`${className || ''} comparison-table`).trim();

          return (
            <ResponsiveTableContainer>
              <table className={combinedClass} {...rest}>
                {children}
              </table>
            </ResponsiveTableContainer>
          );
        }

        // Handle <img> tags
        if (domNode.name === 'img') {
          const { src, alt, class: className, ...rest } = domNode.attribs;
          return (
            <ImageWithSkeleton
              src={src}
              alt={alt}
              className={className}
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
