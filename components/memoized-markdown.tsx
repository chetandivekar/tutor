"use client";

import { marked } from "marked";
import { memo, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button"; // or use plain button if not using shadcn/ui
import { Copy, Check } from "lucide-react";

// Parse markdown into blocks
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

// Memoized block
const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeContent = String(children).replace(/\n$/, "");
            const [copied, setCopied] = useState(false);

            const handleCopy = () => {
              navigator.clipboard.writeText(codeContent);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            };

            return !inline && match ? (
              <div className="relative group">
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeContent}
                </SyntaxHighlighter>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-white"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

// Main component
export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return (
      <>
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock content={block} key={`${id}-block_${index}`} />
        ))}
      </>
    );
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";
