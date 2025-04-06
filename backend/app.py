from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import os
from dotenv import load_dotenv
from supabase import create_client
from uuid import uuid4
from datetime import datetime
from utils import get_favorite_courses, get_course_files

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
CANVAS_BASE_URL = os.getenv("CANVAS_BASE_URL")
CANVAS_TOKEN = os.getenv("CANVAS_TOKEN")
supabase = create_client(supabase_url=SUPABASE_URL, supabase_key=SUPABASE_API_KEY)

app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:3000",
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type"]}
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

@app.route('/users/files', methods=['POST'])
def create_file():
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
                file_url = supabase.storage.from_('donshack2025').get_public_url(file_path)
                new_file.file_url = file_url
                
            except Exception as e:
                return jsonify({"error": f"Error uploading file to Supabase: {str(e)}"}), 500
        
        return jsonify(new_file.to_dict()), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/users', methods=['POST'])
def get_file():
    try:
        data = request.json
        user_id = data.get('userId')
        files = supabase.storage.from_('donshack2025').list('users/'+user_id)
        print(files)
        if len(files) == 0:
            return jsonify({"message":"No files found"}), 404
        return jsonify(files), 200
    except Exception as e:
        return jsonify({"message":"No files found"}), 500
        
            
@app.route('/api/courses', methods=['GET'])
def get_courses():
    if request.method == 'GET':
        try:
            # Get the courses data
            courses = get_favorite_courses(CANVAS_BASE_URL, CANVAS_TOKEN)
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

@app.route('/api/courses/<course_id>/files', methods=['GET'])
def get_course_files_endpoint(course_id):
    try:
        # Get files for the course using the utility function
        file_list = get_course_files(course_id, CANVAS_BASE_URL, CANVAS_TOKEN)
        
        if file_list is None:
            return jsonify({
                "message": "Could not fetch files for the course",
                "error": "Files not found"
            }), 404
        
        return jsonify({
            "message": "Files fetched successfully",
            "course_id": course_id,
            "files": file_list
        }), 200
    except Exception as e:
        print(f"Error fetching files for course {course_id}: {str(e)}")
        return jsonify({
            "message": "Failed to fetch files",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)