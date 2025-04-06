"use client"

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import MathJax from 'react-mathjax';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

import { Card, CardContent } from '@/components/ui/card';

function MarkdownRender(props: any) {
  const newProps = {
    ...props,
    remarkPlugins: [remarkMath, remarkGfm],
    components: {
      ...props.components,
      math: (props: { value: string }) => 
        <MathJax.Node formula={props.value} />,
      inlineMath: (props: { value: string }) =>
        <MathJax.Node inline formula={props.value} />
    }
  };
  
  return (
    <MathJax.Provider input="tex">
      <ReactMarkdown {...newProps} />
    </MathJax.Provider>
  );
}

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const exampleMarkdown = `# Math Examples with MathJax

## Basic Math

Inline math: $E = mc^2$

Display math:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

## Complex Math Examples

### Maxwell's Equations

$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\[1em]
\\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\[0.5em]
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac1c\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\[1em]
\\nabla \\cdot \\vec{\\mathbf{B}} & = 0
\\end{aligned}
$$

### Quantum Mechanics

The Schrödinger equation:

$$
i\\hbar\\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\left [ \\frac{-\\hbar^2}{2m}\\nabla^2 + V(\\mathbf{r},t)\\right ] \\Psi(\\mathbf{r},t)
$$

### Statistics

The normal distribution:

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2}
$$

### Linear Algebra

A matrix equation:

$$
\\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\\\
a_{21} & a_{22} & a_{23} \\\\
a_{31} & a_{32} & a_{33}
\\end{pmatrix}
\\begin{pmatrix}
x_1 \\\\
x_2 \\\\
x_3
\\end{pmatrix} =
\\begin{pmatrix}
b_1 \\\\
b_2 \\\\
b_3
\\end{pmatrix}
$$

### Calculus

The definition of a derivative:

$$
f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}
$$

### Probability

The binomial probability formula:

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

### Complex Analysis

Euler's formula:

$$
e^{ix} = \\cos x + i\\sin x
$$

### Number Theory

The sum of an infinite geometric series:

$$
\\sum_{n=0}^{\\infty} ar^n = \\frac{a}{1-r}, \\quad |r| < 1
$$`;

    setMarkdown(exampleMarkdown);
  }, []);

  return (
    <div className="bg-[#1e2761] min-h-screen p-4 flex flex-col">
      <Card className="flex-1 bg-[#2a3270] border-[#7de2d1]">
        <CardContent className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <MarkdownRender>
              {markdown}
            </MarkdownRender>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
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
        /* MathJax adjustments */
        .MathJax {
          color: #7de2d1 !important;
        }
        .MathJax_Display {
          overflow-x: auto;
          overflow-y: hidden;
          margin: 1.5em 0;
        }
      `}</style>
    </div>
  );
} 