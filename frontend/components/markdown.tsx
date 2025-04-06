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
    const exampleMarkdown = `# Logistic Regression - Part II: Inference and Model Assessment

  ## Overview
  
  This document covers inference methods, model comparison, and diagnostics for logistic regression models, assuming a college-level understanding of statistics and regression. The main objectives are to understand how to perform statistical inference on logistic regression coefficients, compare different logistic regression models, and assess model fit using residuals and pseudo-R-squared measures. The document emphasizes asymptotic results and large sample approximations.
  
  ## I. Wald Test for Individual Coefficients
  
  ### Main Idea
  
  When the sample size *n* is large, the Maximum Likelihood Estimator (MLE) of the coefficients, denoted as  $\hat{\beta_k}$, approximately follows a normal distribution:
  
  $\hat{\beta_k} \overset{\text{approx}}{\sim} N(\beta_k, Var(\hat{\beta_k}))$
  
  ### Variance Calculation
  
  The variance of $\hat{\beta_k}$ is derived from the Hessian matrix of the log-likelihood function.
  
  Let *G* denote the Hessian matrix, where:
  
  $ G = \begin{bmatrix}
    \frac{\partial^2 l}{\partial \beta_1^2} & \frac{\partial^2 l}{\partial \beta_1 \partial \beta_2} & \cdots & \frac{\partial^2 l}{\partial \beta_1 \partial \beta_{p-1}} \\
    \frac{\partial^2 l}{\partial \beta_2 \partial \beta_1} & \frac{\partial^2 l}{\partial \beta_2^2} & \cdots & \frac{\partial^2 l}{\partial \beta_2 \partial \beta_{p-1}} \\
    \vdots & \vdots & \ddots & \vdots \\
    \frac{\partial^2 l}{\partial \beta_{p-1} \partial \beta_1} & \frac{\partial^2 l}{\partial \beta_{p-1} \partial \beta_2} & \cdots & \frac{\partial^2 l}{\partial \beta_{p-1}^2}
  \end{bmatrix}$
  
  Then, the variance of the MLE is:
  
  $Var(\hat{\beta}) = -G^{-1} \Big|_{\beta = \hat{\beta}}$
  
  And the variance of the k-th coefficient is:
  
  $Var(\hat{\beta_k}) = [G^{-1}]_{k+1, k+1}$
  
  Where $\hat{\beta}$ is the MLE of $\beta$.
  
  ### Hypothesis Testing
  
  A large sample test for $\beta_k$ can be constructed as follows:
  
  *   **Null Hypothesis ($H_0$)**: $\beta_k = 0$
  *   **Alternative Hypothesis ($H_1$)**: $\beta_k \neq 0$
  
  ### Test Statistic
  
  The test statistic *Z* is:
  
  $Z = \frac{\hat{\beta_k}}{SE(\hat{\beta_k})}$
  
  Where $SE(\hat{\beta_k})$ is the standard error of $\hat{\beta_k}$.
  
  ### Decision Rule
  
  If $|Z| > Z_{1-\alpha/2}$, reject $H_0$.
  
  ## II. Deviance and Likelihood Ratio Tests for Reduced & Full Models
  
  ### Comparing Models
  
  These tests are used to compare two logistic regression models with different numbers of predictors. For example, testing whether a subset of coefficients are equal to zero.
  
  *   **Null Hypothesis ($H_0$)**: $\beta_r = \beta_{r+1} = ... = \beta_{p-1} = 0$
  *   **Alternative Hypothesis ($H_1$)**: At least one $\beta_j$ (where $j=r, ..., p-1$) is not zero.
  
  This corresponds to comparing a reduced model (under $H_0$) and a full model (under $H_1$).
  
  *   **Reduced Model**:  $logit(\hat{\pi_i}) = \beta_0 + \sum_{j=1}^{r-1} \beta_j x_{ji}$
  *   **Full Model**: $logit(\hat{\pi_i}) = \beta_0 + \sum_{j=1}^{p-1} \beta_j x_{ji}$
  
  The test is based on comparing the log-likelihoods across $H_0$ and $H_1$.
  
  ### Deviance Definition
  
  Deviance is defined as:
  
  $Deviance = -2l(\beta)$, where $l(\beta)$ is the log-likelihood.
  
  ### Likelihood Ratio Test Statistic
  
  The change in deviance ($\Delta D$) is used as the test statistic:
  
  $\Delta D = Deviance(Reduced) - Deviance(Full)$
  
  ### Decision Rule
  
  If $\Delta D > \chi^2_{df, 1-\alpha}$, reject $H_0$.
  
  Where:
  
  *   *df* (degrees of freedom) = $p_{Full} - p_{Reduced}$ (number of parameters in the full model minus number of parameters in the reduced model)
  *   $\chi^2_{df, 1-\alpha}$ is the critical value from the chi-squared distribution with *df* degrees of freedom and significance level $\alpha$.
  
  If we reject $H_0$, there is evidence that the full model provides a significantly better fit according to likelihood.
  
  ### Log-Likelihood for Logistic Regression
  
  Recall that for logistic regression, the log-likelihood is:
  
  $l = \sum_{i=1}^{n} \left[ Y_i \log\left(\frac{\pi_i}{1 - \pi_i}\right) + \log(1 - \pi_i) \right]$
  
  Therefore, the deviance of a fitted model is:
  
  $Dev(\hat{\beta}) = -2 \sum_{i=1}^{n} \left[ y_i \log\left(\frac{\hat{\pi_i}}{1 - \hat{\pi_i}}\right) + \log(1 - \hat{\pi_i}) \right]$
  
  ## III. Deviance Residuals
  
  ### Introduction
  
  Ordinary Least Squares (OLS) residuals are not directly applicable to logistic regression. This section explores alternatives for residual analysis.
  
  *   Observed response: $Y_i = \{0, 1\}$
  *   Predicted response: $\hat{\pi_i} = \hat{P}(Y_i = 1)$
  
  ### Alternatives to OLS Residuals
  
  Two primary alternatives exist: Pearson Residuals and Deviance Residuals.
  
  ### 1. Pearson Residuals
  
  Pearson residuals are similar to studentized residuals in OLS.
  
  $e_i = \frac{y_i - \hat{\pi_i}}{SE(y_i)} = \frac{y_i - \hat{\pi_i}}{\sqrt{\hat{\pi_i}(1 - \hat{\pi_i})}}$
  
  The goal is to observe Pearson residuals scattered randomly and evenly across the x-axis (predictor values).  Interpret these plots like usual residual plots.
  
  ### 2. Deviance Residuals
  
  Deviance residuals are defined as:
  
  $d_i = \begin{cases}
  \sqrt{-2 \left[ y_i \log\left(\frac{\hat{\pi_i}}{1 - \hat{\pi_i}}\right) + \log(1 - \hat{\pi_i}) \right]} & \text{if } y_i = 1 \\
  -\sqrt{-2 \left[ y_i \log\left(\frac{\hat{\pi_i}}{1 - \hat{\pi_i}}\right) + \log(1 - \hat{\pi_i}) \right]} & \text{if } y_i = 0
  \end{cases}$
  
  The square of each deviance residual measures the contribution of each response to the deviance of the fitted model. Check the deviance residuals scatter plot.
  
  ### Pseudo-R-squared
  
  Because there is no OLS principle, the regular $R^2$ doesn't exist for logistic regression to "explain variance".
  
  Several pseudo-$R^2$ statistics have been invented to assess goodness-of-fit.
  
  *   **Efron's Pseudo-$R^2$**:
  
      $pseudo\ R^2 = 1 - \frac{\sum_{i=1}^{n} (y_i - \hat{\pi_i})^2}{\sum_{i=1}^{n} (y_i - \bar{y})^2}$
  *   **McFadden's Pseudo-$R^2$**:
  
      $pseudo\ R^2 = 1 - \frac{l(Full)}{l(Null)}$
  
      Where *l(Full)* is the log-likelihood of the full model, and *l(Null)* is the log-likelihood of the null model.
  
  ### Model Selection
  
  Note: AIC (Akaike Information Criterion) and BIC (Bayesian Information Criterion) can still be used for model selection with logistic regression.
  
  ## Key Takeaways
  
  *   Wald tests, deviance tests, and likelihood ratio tests provide tools for performing statistical inference on logistic regression coefficients and for comparing different models.
  *   Deviance and Pearson residuals help assess the fit of a logistic regression model by examining patterns in the residuals.
  *   Pseudo-R-squared measures provide an indication of how well the model fits the data, although they should be interpreted with caution compared to the R-squared in linear regression.
  `;

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