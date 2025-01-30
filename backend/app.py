import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase Service Account Key
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask is running successfully!"

if __name__ == "__main__":
    app.run(debug=True)