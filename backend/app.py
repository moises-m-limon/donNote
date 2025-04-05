from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import os
from dotenv import load_dotenv
from supabase import create_client
from uuid import uuid4
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
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
        
            
if __name__ == '__main__':
    app.run(debug=True)