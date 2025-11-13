import { BlogContent as BlogContentType } from '@/data/blogPosts';
import { Card } from '@/components/ui/card';
import { CodeHighlighter } from '@/components/visualizations/shared/CodeHighlighter';

interface BlogContentProps {
  content: BlogContentType[];
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <article className="prose prose-lg max-w-none">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="text-3xl font-bold mt-12 mb-6 text-foreground">
                {block.content}
              </h2>
            );
          
          case 'paragraph':
            return (
              <p key={index} className="text-lg leading-relaxed mb-6 text-foreground/90">
                {block.content}
              </p>
            );
          
          case 'list':
            return (
              <ul key={index} className="space-y-3 mb-8 ml-6">
                {block.items?.map((item, i) => (
                  <li key={i} className="text-lg text-foreground/90 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );
          
          case 'code':
            return (
              <div key={index} className="my-8">
                <CodeHighlighter 
                  code={block.content} 
                  language={block.language || 'typescript'}
                />
              </div>
            );
          
          case 'image':
            return (
              <figure key={index} className="my-8">
                <img 
                  src={block.content} 
                  alt={block.alt || ''} 
                  className="w-full rounded-lg shadow-lg"
                />
                {block.alt && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          
          case 'quote':
            return (
              <Card key={index} className="my-8 p-6 border-l-4 border-primary bg-primary/5">
                <p className="text-lg italic text-foreground/90">
                  {block.content}
                </p>
              </Card>
            );
          
          default:
            return null;
        }
      })}
    </article>
  );
};
