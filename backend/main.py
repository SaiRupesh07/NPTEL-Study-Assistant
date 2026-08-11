import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, Field


# Load environment variables
load_dotenv()

app = FastAPI(
    title="NPTEL Study Assistant API",
    description="AI-powered quiz generation backend",
    version="1.0.0",
)


# Allow the React/Vite frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
         "https://nptel-study-assistant-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QuizRequest(BaseModel):
    course: str
    topic: str
    difficulty: str = "medium"
    number_of_questions: int = Field(default=5, ge=1, le=20)


@app.get("/")
def root():
    return {
        "message": "NPTEL Study Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/generate-quiz")
def generate_quiz(request: QuizRequest):

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured."
        )

    client = Groq(api_key=api_key)

    prompt = f"""
Generate an NPTEL-style multiple-choice quiz.

Course:
{request.course}

Topic:
{request.topic}

Difficulty:
{request.difficulty}

Number of questions:
{request.number_of_questions}

Requirements:

1. Generate exactly {request.number_of_questions} questions.
2. Every question must have exactly 4 options.
3. Each question must have exactly one correct answer.
4. The answer must be represented as a zero-based option index.
5. Include the topic for every question.
6. Include a concise explanation for every answer.
7. Do not repeat questions.
8. Questions should test conceptual understanding.
9. Questions should be appropriate for an engineering student preparing for NPTEL.
"""

    try:

        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert NPTEL professor and "
                        "professional quiz-generation assistant."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.4,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "nptel_quiz",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "string"
                                        },
                                        "question": {
                                            "type": "string"
                                        },
                                        "options": {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        },
                                        "answer": {
                                            "type": "integer"
                                        },
                                        "topic": {
                                            "type": "string"
                                        },
                                        "explanation": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "id",
                                        "question",
                                        "options",
                                        "answer",
                                        "topic",
                                        "explanation"
                                    ],
                                    "additionalProperties": False
                                }
                            }
                        },
                        "required": [
                            "questions"
                        ],
                        "additionalProperties": False
                    }
                }
            }
        )

        content = response.choices[0].message.content

        quiz = json.loads(content)

        return quiz

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {str(e)}"
        )