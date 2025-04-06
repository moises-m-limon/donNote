"use client";
import React, { useState } from "react";

import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

// eslint-disable-next-line no-useless-escape
const INITIAL_MACROS = { "\\f": "#1f(#2)" };

export default function MarkdownPage() {
  const [text, setText] = useState(
    "This document provides an overview of statistical inference and model assessment techniques for logistic regression. It covers methods for testing individual coefficients, comparing nested models, and assessing model fit using residuals and pseudo-$R^2$ measures. These methods are based on asymptotic results, making them applicable when the sample size is large.\n\nThe first topic discussed is the Wald test for individual coefficients. This test relies on the asymptotic normality of the maximum likelihood estimator (MLE) $\\hat{\\beta}_k$, which is approximately distributed as $N(\\beta_k, \\text{Var}(\\hat{\\beta}_k))$. The variance of the MLE is derived from the Hessian matrix $G$ of the log-likelihood function, where $\\text{Var}(\\hat{\\beta}) = -G^{-1}|_{\\beta = \\hat{\\beta}}$. The test statistic is $Z = \\frac{\\hat{\\beta}_k}{\\text{SE}(\\hat{\\beta}_k)}$"
  );

  return (
    <main style={{ padding: 12, maxWidth: 780 }}>
      <div>
        <Latex strict={false} macros={INITIAL_MACROS}>
          {text}
        </Latex>
      </div>
    </main>
  );
}
