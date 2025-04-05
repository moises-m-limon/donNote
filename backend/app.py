from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
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


if __name__ == '__main__':
    app.run(debug=True)
