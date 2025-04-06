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

SUMMARIZE_SYSTEM_PROMPT = """You are an educational content analyzer specializing in creating clear, concise, and well-structured summaries of academic documents. Your task is to transform complex college-level course materials into accessible markdown summaries that maintain academic rigor while improving clarity.

Follow these guidelines when creating summaries:
1. Begin with a clear title and overview section that identifies the subject, course level, and main objectives
2. Use proper markdown formatting including headers (# for main sections, ## for subsections), bullet points, numbered lists, and emphasis where appropriate
3. Preserve key terminology, concepts, definitions, theories, and academic citations
4. Organize content logically with a clear hierarchy that mirrors the academic structure of the original
5. Include a "Key Takeaways" section at the end that highlights 3-5 essential points
6. Keep your summary concise but comprehensive, focusing on depth of understanding rather than covering everything superficially
7. Use tables for comparative information or structured data when relevant
8. If the document includes examples, include at least one representative example in your summary

Your output must be properly formatted in markdown and ready for student use as a study aid."""

SUMMARIZE_USER_PROMPT = """Please create a comprehensive markdown summary of the attached college course document. The summary should:

1. Capture the essential content and main points of the document
2. Maintain the logical structure and flow of information
3. Identify key concepts, theories, and terminology with clear explanations
4. Include any critical formulas, methods, or frameworks
5. Highlight important examples or case studies
6. Note any crucial deadlines, requirements, or grading criteria if present
7. Be formatted in clear, readable markdown with appropriate headings, lists, and emphasis

Please organize the content to be easily scannable and useful for study purposes. Make sure to maintain academic accuracy while making the content more accessible."""
