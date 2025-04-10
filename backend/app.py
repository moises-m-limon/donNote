import os
from flask import Flask, Blueprint
from flask_cors import CORS
from flask import request, jsonify
from supabase import create_client
from uuid import uuid4
from datetime import datetime
from dotenv import load_dotenv
from utils import get_favorite_courses, get_course_files, summerize_file, summerize_text, generate_questions_from_file, generate_questions_from_text
from google import genai
from configs import SUMMARIZE_FILE_SYSTEM_PROMPT, SUMMARIZE_FILE_USER_PROMPT, SUPABASE_URL, SUPABASE_API_KEY, GEMINI_API_KEY, CANVAS_BASE_URL, CANVAS_TOKEN, SUMMARIZE_NOTES_USER_PROMPT, SUMMARIZE_NOTES_SYSTEM_PROMPT, GENERATE_QUESTIONS_FILE_SYSTEM_PROMPT, GENERATE_QUESTIONS_FILE_USER_PROMPT, GENERATE_QUESTIONS_TEXT_SYSTEM_PROMPT, GENERATE_QUESTIONS_TEXT_USER_PROMPT
import json

# Load environment variables
load_dotenv()

supabase = create_client(supabase_url=SUPABASE_URL,
                         supabase_key=SUPABASE_API_KEY)

client = genai.Client(api_key=GEMINI_API_KEY)

# Start app instance
app = Flask(__name__)

# Check if we're in development or production
prod = os.environ.get("DEV") or 'production'
print(prod)

# Configure CORS based on environment
if prod == 'development':
    CORS(app, resources={
        r"/api/*": {"origins": "http://localhost:3000",
                    "methods": ["GET", "POST", "OPTIONS"],
                    "allow_headers": ["Content-Type"]}
    })
else:
    CORS(app, resources={
        r"/api/*": {
            "origins": "https://don-note.vercel.app",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })


@app.route('/api/notes', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        return jsonify({"message": "Note created successfully"}), 201
    elif request.method == 'GET':
        return jsonify({"message": "Notes fetched successfully"}), 200


class File:
    def __init__(self, userId, file_content, file_name=None):
        self.id = str(uuid4())
        self.userId = userId
        self.file_content = file_content
        self.file_name = file_name
        self.date_created = datetime.utcnow()
        self.date_updated = self.date_created

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.userId,
            'date_created': self.date_created.isoformat(),
            'date_updated': self.date_updated.isoformat(),
            'file_content': self.file_content,
            'file_name': self.file_name,
        }


@app.route('/api/users/files', methods=['POST', 'OPTIONS'])
def create_file():
    print(f"Received {request.method} request to /api/users/files")

    if request.method == 'OPTIONS':
        response = jsonify({})
        return response

    print("Processing POST request with data")
    try:
        data = request.json
        user_id = data.get('userId')
        file_content = data.get('file_content', '')
        file_name = data.get('file_name', '')

        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Create a File object
        new_file = File(
            userId=user_id,
            file_content=file_content,
            file_name=file_name
        )

        # If file content is provided, upload to Supabase
        if file_content and file_name:
            try:
                file_path = f"users/{user_id}/{file_name}"
                # Upload to Supabase storage
                response = supabase.storage.from_('donshack2025').upload(
                    file_path,
                    file_content.encode(),
                    {"content-type": "text/plain"}
                )

                # Get the public URL
                file_url = supabase.storage.from_(
                    'donshack2025').get_public_url(file_path)
                new_file.file_url = file_url

            except Exception as e:
                return jsonify({"error": f"Error uploading file to Supabase: {str(e)}"}), 500

        return jsonify(new_file.to_dict()), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/users', methods=['POST', 'OPTIONS'])
def get_file():
    if request.method == 'OPTIONS':
        response = jsonify({})
        return response
    try:
        data = request.json
        user_id = data.get('userId')
        files = supabase.storage.from_('donshack2025').list('users/'+user_id)

        print(files)
        if len(files) == 0:
            return jsonify({"message": "No files found"}), 404
        return jsonify(files), 200
    except Exception as e:
        return jsonify({"message": "No files found"}), 500


@app.route('/api/courses', methods=['POST'])
def get_courses():
    if request.method == 'POST':
        try:
            # Get the token from the request body
            data = request.get_json()
            url = data.get('url')
            token = data.get('token')
            
            if not token:
                return jsonify({
                    "message": "Missing token in request body",
                    "error": "Unauthorized"
                }), 401
            
            # Get the courses data
            courses = get_favorite_courses(url, token)
            # Extract course names and IDs
            course_list = []
            for course in courses:
                course_list.append({
                    "id": course.get("id"),
                    "name": course.get("name"),
                    "course_code": course.get("course_code")
                })

            return jsonify({
                "message": "Courses fetched successfully",
                "courses": course_list
            }), 200
        except Exception as e:
            print(f"Error fetching courses: {str(e)}")
            return jsonify({
                "message": "Failed to fetch courses",
                "error": str(e)
            }), 500


@app.route('/api/courses/<course_id>/files', methods=['POST'])
def get_course_files_endpoint(course_id):
    try:
        # Get the token from the request body
        data = request.get_json()
        url = data.get('url')
        token = data.get('token')
        
        if not token:
            return jsonify({
                "message": "Missing token in request body",
                "error": "Unauthorized"
            }), 401
        
        # Get files for the course using the utility function
        file_list = get_course_files(course_id, url, token)

        if file_list is None:
            return jsonify({
                "message": "Could not fetch files for the course",
                "error": "Files not found"
            }), 404

        return jsonify({
            "message": "Files fetched successfully",
            "course_id": course_id,
            "files": file_list,
        }), 200
    except Exception as e:
        print(f"Error fetching files for course {course_id}: {str(e)}")
        return jsonify({
            "message": "Failed to fetch files",
            "error": str(e)
        }), 500


@app.route('/api/summarize-file', methods=['POST'])
def summarize_file_1():
    if request.method == 'POST':
        data = request.get_json()
        file_name = data.get("file_name")
        id = data.get("id")

        # Create temp directory if it doesn't exist
        if not os.path.exists('temp'):
            os.makedirs('temp')

        try:
            # Download the file from Supabase
            response = supabase.storage.from_("donshack2025").download(
                "users/" + id + "/" + file_name)

            # Write the response to a file in the temp directory
            with open(os.path.join('temp', file_name), "wb") as file:
                file.write(response)

            # Summarize the file
            summary = summerize_file(client, os.path.join(file_name),
                                     SUMMARIZE_FILE_USER_PROMPT, SUMMARIZE_FILE_SYSTEM_PROMPT)

            print('here', SUMMARIZE_FILE_SYSTEM_PROMPT)
            print('here', SUMMARIZE_FILE_USER_PROMPT)

            print(summary)

            with open("summary.txt", "w") as file:
                file.write(summary)

            return jsonify({
                "message": "File downloaded and saved successfully",
                "summary": summary
            }), 200

        except Exception as e:
            return jsonify({
                "message": "Failed to download or save file",
                "error": str(e)
            }), 500


@app.route('/api/summarize-text', methods=['POST'])
def summarize_file():
    if request.method == 'POST':
        data = request.get_json()
        str = data.get("str")
        id = data.get("id")

        try:
            # Summarize the file
            summary = summerize_text(client, str,
                                     SUMMARIZE_NOTES_USER_PROMPT, SUMMARIZE_NOTES_SYSTEM_PROMPT)

            print(summary)

            return summary, 200

        except Exception as e:
            return jsonify({
                "message": "Failed to download or save file",
                "error": str(e)
            }), 500


@app.route('/api/generate-questions-file', methods=['POST'])
def generate_questions_file():
    if request.method == 'POST':
        data = request.get_json()
        file_name = data.get("file_name")
        id = data.get("id")
        # Default to 5 questions if not specified
        num_questions = data.get("num_questions", 5)

        # Create temp directory if it doesn't exist
        if not os.path.exists('temp'):
            os.makedirs('temp')

        try:
            # Download the file from Supabase
            response = supabase.storage.from_("donshack2025").download(
                "users/" + id + "/" + file_name)

            # Write the response to a file in the temp directory
            with open(os.path.join('temp', file_name), "wb") as file:
                file.write(response)

            # Generate questions from the file
            questions_data = generate_questions_from_file(client, os.path.join(file_name),
                                                          GENERATE_QUESTIONS_FILE_USER_PROMPT, GENERATE_QUESTIONS_FILE_SYSTEM_PROMPT,
                                                          num_questions)

            # Check if we have valid questions data
            if "questions" in questions_data:
                # Save the questions to a file for reference
                with open("questions.txt", "w") as file:
                    file.write(json.dumps(questions_data, indent=2))

                return jsonify({
                    "message": "Questions generated successfully",
                    "questions": questions_data["questions"],
                    "total_questions": len(questions_data["questions"])
                }), 200
            else:
                # If there was an error or no questions found
                return jsonify({
                    "message": "Failed to generate valid questions",
                    "error": questions_data.get("error", "Unknown error"),
                    "raw_response": questions_data.get("raw_text", "")
                }), 500

        except Exception as e:
            return jsonify({
                "message": "Failed to generate questions",
                "error": str(e)
            }), 500


@app.route('/api/generate-questions-text', methods=['POST', 'OPTIONS'])
def generate_questions_text():
    if request.method == 'OPTIONS':
        response = jsonify({})
        return response
    if request.method == 'POST':
        data = request.get_json()
        text = data.get("text")
        id = data.get("id")
        # Default to 5 questions if not specified
        num_questions = data.get("num_questions", 5)

        try:
            # Generate questions from the text
            questions_data = generate_questions_from_text(client, text,
                                                          GENERATE_QUESTIONS_TEXT_USER_PROMPT, GENERATE_QUESTIONS_TEXT_SYSTEM_PROMPT,
                                                          num_questions)

            # Check if we have valid questions data
            if "questions" in questions_data:
                # Save the questions to a file for reference
                with open("questions.txt", "w") as file:
                    file.write(json.dumps(questions_data, indent=2))

                return jsonify({
                    "message": "Questions generated successfully",
                    "questions": questions_data["questions"],
                    "total_questions": len(questions_data["questions"])
                }), 200
            else:
                # If there was an error or no questions found
                return jsonify({
                    "message": "Failed to generate valid questions",
                    "error": questions_data.get("error", "Unknown error"),
                    "raw_response": questions_data.get("raw_text", "")
                }), 500

        except Exception as e:
            return jsonify({
                "message": "Failed to generate questions",
                "error": str(e)
            }), 500


if __name__ == '__main__':
    print('t')
    prod = os.environ.get("DEV") or 'production'
    if prod == 'development':
        app.run(debug=True, use_reloader=False)
    else:
        app.run(debug=True, host="0.0.0.0", port=int(
            os.environ.get("PORT", 8080)))
