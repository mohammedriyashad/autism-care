VoiceMe AAC – AI-Powered Supportive AAC Dashboard

VoiceMe AAC is an intelligent Assistive and Augmentative Communication (AAC) platform designed to support autistic and non-verbal individuals using AI-powered communication assistance, emotion detection, gesture recognition, and symbol-based interaction.

The system combines:

Real-time emotion and gesture analysis

AI caregiver assistance

AAC symbol communication

Speech and typed notes

Live communication signals dashboard



---

Features

AI Caregiver Assistant

AI-powered communication support

Generates supportive responses based on child emotions and gestures

Integrated with Gemini/Groq-based LLM support


Emotion Detection

Detects emotions using webcam input

Displays live emotional state

Real-time confidence percentage


Gesture Recognition

Detects communication gestures

Helps identify child needs non-verbally


AAC Symbol Board

Symbol-based communication interface

Categorized interaction system:

Needs

Feelings

Activities

People

Places

Objects



Communication Dashboard

Live communication signals

Emotion + pose + speech tracking

Voice or typed notes support


Reports & Profiles

Profile management

Communication tracking reports

Session monitoring



---

Tech Stack

Frontend

React.js

Vite

JavaScript

CSS


Backend

FastAPI

Python


AI / ML

Gemini API / Groq API

TensorFlow

OpenCV


Database

SQLite



---

Project Structure

voiceme/
│
├── frontend/              # React frontend
├── routes/                # FastAPI routes
├── static/                # Static assets
├── templates/             # HTML templates
├── uploads/               # Uploaded files
├── utils/                 # Config and helper utilities
├── models/                # ML models
├── profiles/              # User profiles
├── reports/               # Reports data
├── main.py                # FastAPI entry point
├── requirements.txt
└── .env


---

Installation

1. Clone Repository

git clone https://github.com/yourusername/voiceme-aac.git
cd voiceme-aac


---

Backend Setup

Create Virtual Environment

python -m venv .venv

Activate Environment

Windows

.\.venv\Scripts\activate

Linux / Mac

source .venv/bin/activate

Install Dependencies

pip install -r requirements.txt


---

Frontend Setup

cd frontend
npm install


---

Environment Variables

Create a .env file in the root folder:

GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-1.5-flash
HOST=0.0.0.0
PORT=8000
DEBUG=True
SECRET_KEY=your-secret-key


---

Running the Project

Start Backend

uvicorn main:app --reload

Backend runs on:

http://127.0.0.1:8000


---

Start Frontend

Open a second terminal:

cd frontend
npm run dev

Frontend runs on:

http://localhost:5173


---

API Integration

The project supports:

Google Gemini API

Groq API


You can switch providers easily using environment variables.


---

Future Enhancements

Speech-to-text support

Multi-language AAC support

Cloud deployment

Personalized AI caregiver memory

Mobile application support

Advanced autism behavior analytics



---

Screenshots

Add screenshots of:

Dashboard

Emotion detection

Symbol board

AI caregiver assistant

Reports page



---

Use Case

VoiceMe AAC aims to improve communication accessibility for autistic and non-verbal individuals by combining AI assistance with visual communication systems.

This project can be used in:

Special education

Autism support centers

Therapy environments

Caregiver assistance systems

Research projects



---

Author

Mohammed Riyashad

Artificial Intelligence & Machine Learning Student


---

License

This project is for educational and research purposes.