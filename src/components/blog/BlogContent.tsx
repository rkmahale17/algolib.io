import "../../styles/blog.css";

import { ArrowRight, ExternalLink } from "lucide-react";

import { Arrow } from "@radix-ui/react-tooltip";
import { BlogContent as BlogContentType } from "@/data/blogPosts";
import { Button } from "../ui/button";
import { CodeHighlighter } from "@/components/visualizations/shared/CodeHighlighter";
import { Link } from "react-router-dom";

interface BlogContentProps {
  content: BlogContentType[];
}

export const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <article className="blog-article">
      {content.map((block, index) => {
        switch (block.type) {
          case "heading":
            // Main heading - H2
            return (
              <h2 key={index} className="blog-section">
                {block.content}
              </h2>
            );

          case "subheading":
            // Topic section - H3
            return (
              <h3 key={index} className={block.large ? "section-large" : ""}>
                {block.content}
              </h3>
            );

          case "h4":
            // Subsection - H4
            return <h4 key={index}>{block.content}</h4>;

          case "h5":
            // Specific point - H5
            return <h5 key={index}>{block.content}</h5>;

          case "paragraph":
            return (
              <p
                key={index}
                dangerouslySetInnerHTML={{ __html: block.content }}
              ></p>
            );

          case "list":
            return (
              <ul key={index}>
                {block.items?.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );

          case "code":
            return (
              <div key={index}>
                <CodeHighlighter
                  code={block.content}
                  language={block.language || "typescript"}
                />
              </div>
            );

          case "image":
            return (
              // <header style={background:block.content}></header>
              <figure key={index}>
                <img
                  src={block.content}
                  alt={block.alt || block.caption || "Blog illustration"}
                  loading="lazy"
                />
                {(block.caption || block.alt) && (
                  <figcaption>{block.caption || block.alt}</figcaption>
                )}
              </figure>
            );

          case "quote":
            return <blockquote key={index}>{block.content}</blockquote>;

          case "cta":
            return (
              // <div
              //   key={index}
              //   style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
              // >
              //   <Link
              //     to={block.link || "#"}
              //     className="text-primary hover:text-primary hover:bg-primary/10 underline-offset-0 "
              //     target="_blank"
              //     rel="noopener noreferrer"
              //   >
              //     {block.content}
              //     <ArrowRight className="w-4 h-4" />
              //   </Link>
              // </div>
              <Link
                key={index}
                to={block.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-b-0"
              >
                <Button
                  style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10 gap-1"
                >
                  {block.content}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              // </div>
            );

          default:
            return null;
        }
      })}
    </article>
  );
};
