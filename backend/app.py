from flask import Flask
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={
    r"/api/*": {"origins": "http://localhost:3000",
                "methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["Content-Type"]}
                })

@app.route('/notes')
def home():
    return "Here are notes!"

if __name__ == '__main__':
    app.run(debug = True)