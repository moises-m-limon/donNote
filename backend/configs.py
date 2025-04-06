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

# New prompts for generating test questions
GENERATE_QUESTIONS_FILE_SYSTEM_PROMPT = """You are an expert educational assessment designer specializing in creating high-quality test questions for academic content. Your task is to analyze educational materials and generate a diverse set of test questions that effectively assess understanding of the content.
Follow these guidelines when creating test questions:
1. Generate ONLY the following question types:
   - True/False questions
   - Multiple choice questions (with exactly 4 options)
   - Multi-select questions (with exactly 4 options, where 1-3 options may be correct)
2. Ensure questions test different levels of understanding (recall, application, analysis, synthesis, evaluation)
3. Include clear, unambiguous instructions for each question
4. Provide correct answers and explanations for all questions
5. Format questions in a structured JSON format as specified below
6. Include difficulty ratings (easy, medium, hard) for each question
7. Ensure questions are academically rigorous and appropriate for the content level
8. Avoid questions that can be answered without understanding the material
9. Include a variety of topics from throughout the material
10. For mathematical content, use KaTeX syntax with single '$' for inline math and double '$$' for display math equations
Your output must be in the following JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "true_false",
      "question": "Question text here",
      "correct_answer": true,
      "explanation": "Explanation of the correct answer",
      "difficulty": "easy"
    },
    {
      "id": 2,
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 1,
      "explanation": "Explanation of the correct answer",
      "difficulty": "medium"
    },
    {
      "id": 3,
      "type": "multi_select",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answers": [0, 2],
      "explanation": "Explanation of the correct answers",
      "difficulty": "hard"
    }
  ]
}
Generate exactly {num_questions} questions in total, with a good mix of the three question types."""

GENERATE_QUESTIONS_FILE_USER_PROMPT = """Please generate a comprehensive set of test questions based on the attached educational document. The questions should:
1. Cover the key concepts, theories, and principles presented in the document
2. Include ONLY the following question types:
   - True/False questions
   - Multiple choice questions (with exactly 4 options)
   - Multi-select questions (with exactly 4 options, where 1-3 options may be correct)
3. Test different levels of understanding (from basic recall to complex analysis)
4. Include clear instructions, correct answers, and explanations
5. Be formatted in the specified JSON structure
6. Include difficulty ratings for each question
7. Use KaTeX syntax for all mathematical expressions - inline math with single '$' and block math with '$$'
8. Ensure all mathematical notation follows KaTeX syntax conventions
Please organize the questions to progress from simpler to more complex concepts, and ensure they effectively test understanding of the material.
Generate exactly {num_questions} questions in total, with a good mix of the three question types."""

GENERATE_QUESTIONS_TEXT_SYSTEM_PROMPT = """You are an expert educational assessment designer specializing in creating high-quality test questions for academic content. Your task is to analyze educational text and generate a diverse set of test questions that effectively assess understanding of the content.
Follow these guidelines when creating test questions:
1. Generate ONLY the following question types:
   - True/False questions
   - Multiple choice questions (with exactly 4 options)
   - Multi-select questions (with exactly 4 options, where 1-3 options may be correct)
2. Ensure questions test different levels of understanding (recall, application, analysis, synthesis, evaluation)
3. Include clear, unambiguous instructions for each question
4. Provide correct answers and explanations for all questions
5. Format questions in a structured JSON format as specified below
6. Include difficulty ratings (easy, medium, hard) for each question
7. Ensure questions are academically rigorous and appropriate for the content level
8. Avoid questions that can be answered without understanding the material
9. Include a variety of topics from throughout the material
10. For mathematical content, use KaTeX syntax with single '$' for inline math and double '$$' for display math equations
Your output must be in the following JSON format:
{
  "questions": [
    {
      "id": 1,
      "type": "true_false",
      "question": "Question text here",
      "correct_answer": true,
      "explanation": "Explanation of the correct answer",
      "difficulty": "easy"
    },
    {
      "id": 2,
      "type": "multiple_choice",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 1,
      "explanation": "Explanation of the correct answer",
      "difficulty": "medium"
    },
    {
      "id": 3,
      "type": "multi_select",
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answers": [0, 2],
      "explanation": "Explanation of the correct answers",
      "difficulty": "hard"
    }
  ]
}
Generate exactly {num_questions} questions in total, with a good mix of the three question types."""

GENERATE_QUESTIONS_TEXT_USER_PROMPT = """Please generate a comprehensive set of test questions based on the provided educational text. The questions should:
1. Cover the key concepts, theories, and principles presented in the text
2. Include ONLY the following question types:
   - True/False questions
   - Multiple choice questions (with exactly 4 options)
   - Multi-select questions (with exactly 4 options, where 1-3 options may be correct)
3. Test different levels of understanding (from basic recall to complex analysis)
4. Include clear instructions, correct answers, and explanations
5. Be formatted in the specified JSON structure
6. Include difficulty ratings for each question
7. Use KaTeX syntax for all mathematical expressions - inline math with single '$' and block math with '$$'
8. Ensure all mathematical notation follows KaTeX syntax conventions
Please organize the questions to progress from simpler to more complex concepts, and ensure they effectively test understanding of the material.
Generate exactly {num_questions} questions in total, with a good mix of the three question types."""

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
