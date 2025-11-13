import { BlogContent as BlogContentType } from '@/data/blogPosts';
import { CodeHighlighter } from '@/components/visualizations/shared/CodeHighlighter';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import '../../styles/blog.css';

interface BlogContentProps {
  content: BlogContentType[];
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <article className="blog-article">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index}>
                {block.content}
              </h2>
            );
          
          case 'paragraph':
            return (
              <p key={index}>
                {block.content}
              </p>
            );
          
          case 'list':
            return (
              <ul key={index}>
                {block.items?.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          
          case 'code':
            return (
              <div key={index}>
                <CodeHighlighter 
                  code={block.content} 
                  language={block.language || 'typescript'}
                />
              </div>
            );
          
          case 'image':
            return (
              <figure key={index}>
                <img 
                  src={block.content} 
                  alt={block.alt || ''} 
                  loading="lazy"
                />
                {block.alt && (
                  <figcaption>
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          
          case 'quote':
            return (
              <blockquote key={index}>
                {block.content}
              </blockquote>
            );
          
          case 'cta':
            return (
              <div key={index} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <Button asChild className="blog-cta-button">
                  <Link to={block.link || '#'}>
                    <Play className="w-4 h-4" />
                    {block.content}
                  </Link>
                </Button>
              </div>
            );
          
          default:
            return null;
        }
      })}
    </article>
  );
};
