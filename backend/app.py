from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from dotenv import load_dotenv
import os
from utils import get_favorite_courses

load_dotenv()
token = os.getenv("CAVNAS_API_KEY")
CANVAS_BASE_URL = "https://usfca.instructure.com/"
DOWNLOAD_ROOT = './ClassMaterials'

# if not os.path.exists(DOWNLOAD_ROOT):
#     os.makedirs(DOWNLOAD_ROOT)

# os.chdir(os.path.expanduser(DOWNLOAD_ROOT))

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


@app.route('/api/courses', methods=['GET'])
def get_courses():
    if request.method == 'GET':
        try:
            # Get the courses data
            courses = get_favorite_courses(CANVAS_BASE_URL, token)
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


if __name__ == '__main__':
    app.run(debug=True)
