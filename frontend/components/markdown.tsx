"use client"
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

const MarkdownReader = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // Example with various LaTeX expressions
    const exampleMarkdown = `When you summarize text, it will appear here instead!`;

    setMarkdown(exampleMarkdown);
  }, []);

  return (
    <div className="bg-[#1e2761] min-h-screen p-4 flex flex-col">
      <Card className="flex-1 bg-[#2a3270] border-[#7de2d1]">
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        /* Custom styling for KaTeX elements */
        .katex {
          font-size: 1.1em;
        }
        .katex-display {
          margin: 1.5em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .katex-display > .katex {
          text-align: center;
          color: #7de2d1;
        }
        /* Dark theme adjustments */
        .prose {
          color: #ffffff;
        }
        .prose h1, .prose h2, .prose h3 {
          color: #7de2d1;
        }
        .prose strong {
          color: #f9e94e;
        }
        .prose code {
          background: #1e2761;
          color: #7de2d1;
          padding: 0.2em 0.4em;
          border-radius: 0.3em;
        }
        .prose pre {
          background: #1e2761;
          border: 1px solid #7de2d1;
        }
        /* Math display adjustments */
        .katex-html {
          color: #7de2d1;
        }
        .katex .mord {
          color: #7de2d1;
        }
        .katex .mrel {
          color: #f9e94e;
        }
        .katex .mbin {
          color: #f9e94e;
        }
      `}</style>
    </div>
  );
};

export default MarkdownReader;