import os
from dotenv import load_dotenv
# Load environment variables
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
CANVAS_BASE_URL = os.getenv("CANVAS_BASE_URL")
CANVAS_TOKEN = os.getenv("CANVAS_TOKEN")

SUMMARIZE_FILE_SYSTEM_PROMPT = """Please summarize the attached college-level academic document.

Your output should be a JSON object with the following structure:
{
  "summary": "Plain text summary with appropriate paragraph spacing. All mathematical expressions must use LaTeX syntax, wrapped in $...$ for inline math or $$...$$ for display math. Do not use any LaTeX document-level commands such as \\section, \\subsection, or environments like \\begin{itemize}.",
  "key_point1": "First key takeaway...",
  "key_point2": "Second key takeaway...",
  "key_point3": "Third key takeaway...",
  "...": "Additional key points as needed"
}

Formatting instructions:
- The summary should be written in plain, natural language with clear paragraph breaks
- Mathematical expressions must be written using LaTeX syntax (e.g., $E=mc^2$ or $$f(x) = x^2 + 3x + 2$$)
- Do not use LaTeX structural formatting (no \\section{}, \\begin{}, etc.)
- Questions from the document should be included using LaTeX formatting for math expressions only
- Define key academic concepts clearly
- Include relevant formulas and methods when appropriate
- Conclude with a section titled “Key Takeaways” containing 3–5 plain-text bullet points
"""


SUMMARIZE_FILE_USER_PROMPT = """You are an educational content analyzer specializing in summarizing complex college-level course materials. Your job is to transform dense academic documents into accessible, concise, and clearly structured content.

Your output must be a JSON object with the following structure:
{
  "summary": "A plain text summary with clearly formatted newlines. All equations must be written using LaTeX math syntax, such as $...$ for inline math or $$...$$ for display math. Do not include any LaTeX commands like \\section or \\begin{itemize}.",
  "key_point1": "First major takeaway...",
  "key_point2": "Second major takeaway...",
  "key_point3": "Third major takeaway...",
  "...": "Additional key points as needed"
}

Important:
- The entire output must be plain text with proper paragraph structure
- Use LaTeX only for equations and mathematical expressions (inline or display style)
- Do not use LaTeX environments (e.g., \\section{}, \\begin{}, etc.)
- If the original document contains any questions, present them using LaTeX-formatted math expressions only, not full LaTeX question environments
"""


SUMMARIZE_NOTES_SYSTEM_PROMPT = """Please summarize the attached college-level academic document.

Your output should be a JSON object with the following structure, RETURN ONLY THE JSON OBJECT AND NOTHING ELSE:
{
  "summary": "Plain text summary with appropriate paragraph spacing. All mathematical expressions must use LaTeX syntax, wrapped in $...$ for inline math or $$...$$ for display math. Do not use any LaTeX document-level commands such as \\section, \\subsection, or environments like \\begin{itemize}.",
  "key_point1": "First key takeaway...",
  "key_point2": "Second key takeaway...",
  "key_point3": "Third key takeaway...",
  "...": "Additional key points as needed"
}

Formatting instructions:
- The summary should be written in plain, natural language with clear paragraph breaks
- Mathematical expressions must be written using LaTeX syntax (e.g., $E=mc^2$ or $$f(x) = x^2 + 3x + 2$$)
- Do not use LaTeX structural formatting (no \\section{}, \\begin{}, etc.)
- Questions from the document should be included using LaTeX formatting for math expressions only
- Define key academic concepts clearly
- Include relevant formulas and methods when appropriate
- Conclude with a section titled “Key Takeaways” containing 3–5 plain-text bullet points
"""

SUMMARIZE_NOTES_USER_PROMPT = """You are an educational content analyzer specializing in summarizing complex college-level course materials. Your job is to transform dense academic documents into accessible, concise, and clearly structured content.

Your output must be a JSON object with the following structure, RETURN ONLY THE JSON OBJECT AND NOTHING ELSE:
{
  "summary": "A plain text summary with clearly formatted newlines. All equations must be written using LaTeX math syntax, such as $...$ for inline math or $$...$$ for display math. Do not include any LaTeX commands like \\section or \\begin{itemize}.",
  "key_point1": "First major takeaway...",
  "key_point2": "Second major takeaway...",
  "key_point3": "Third major takeaway...",
  "...": "Additional key points as needed"
}

Important:
- The entire output must be plain text with proper paragraph structure
- Use LaTeX only for equations and mathematical expressions (inline or display style)
- Do not use LaTeX environments (e.g., \\section{}, \\begin{}, etc.)
- If the original document contains any questions, present them using LaTeX-formatted math expressions only, not full LaTeX question environments
"""
