import os
import re
import requests
import logging
import json
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.user import Candidate, SessionLocal
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# OpenRouter API details
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logging.error("OpenRouter API Key not found. Set it in the .env file.")
    raise RuntimeError("OpenRouter API Key not found. Set it in the .env file.")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL_NAME = "google/gemini-flash-1.5"

# Logging setup
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# WebSocket connections storage
active_connections = set()


class CandidateResponse(BaseModel):
    name: str
    email: str
    response: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.websocket("/ws/recruiter")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    logger.info("New recruiter connected via WebSocket")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info("Recruiter disconnected from WebSocket")


async def notify_recruiters(message: dict):
    logger.info(f"Notifying recruiters: {message}")
    for connection in active_connections:
        await connection.send_text(json.dumps(message))



def extract_traits_from_ai_response(ai_response: str):
    """Extracts personality traits from AI JSON response."""
    default_traits = {
        "openness": 50.0,
        "conscientiousness": 50.0,
        "extraversion": 50.0,
        "agreeableness": 50.0,
        "neuroticism": 50.0,
    }

    try:
        # Extract JSON content from the AI response string
        json_start = ai_response.find("{")
        json_end = ai_response.rfind("}") + 1
        if json_start == -1 or json_end == -1:
            raise ValueError("JSON content not found in AI response")

        json_content = ai_response[json_start:json_end]
        # Remove any leading or trailing backticks and newlines
        json_content = json_content.strip("`").strip()
        traits = json.loads(json_content)

        # Normalize keys to lowercase to handle case sensitivity
        traits = {k.lower(): v for k, v in traits.items()}

        # Update default values only if they exist in AI response
        for trait in default_traits.keys():
            if trait in traits and isinstance(traits[trait], (int, float)):
                default_traits[trait] = float(traits[trait])

    except (json.JSONDecodeError, ValueError) as e:
        logger.error(f"Failed to parse AI response as JSON: {e}. Using default traits.")

    return default_traits


@router.post("/submit_response")
async def submit_response(candidate: CandidateResponse, db: Session = Depends(get_db)):
    logger.info(f"Received response submission for {candidate.email}")

    existing_candidate = db.query(Candidate).filter(Candidate.email == candidate.email).first()
    if existing_candidate:
        logger.warning("Email already exists. Rejecting request.")
        raise HTTPException(status_code=400, detail="Email already exists. Please use a different email.")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
    "model": "google/gemini-flash-1.5",
    "messages": [
        {
            "role": "system",
            "content": "You are an AI specializing in Big Five personality assessment. Analyze the given response and provide a structured JSON output with personality traits (openness, conscientiousness, extraversion, agreeableness, neuroticism) on a scale of 0-100."
        },
        {
            "role": "user",
            "content": f"Analyze the personality traits for this response and return a JSON object: '{candidate.response}'"
        }
    ],
    "temperature": 0.5,
}


    logger.info("Sending request to OpenRouter API...")
    try:
        response = requests.post(OPENROUTER_URL, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        logger.info(f"OpenRouter API response: {response.text}")
        ai_response = response.json()

        if "choices" in ai_response and ai_response["choices"]:
            response_text = ai_response["choices"][0].get("message", {}).get("content", "").strip()
            if response_text:
                traits = extract_traits_from_ai_response(response_text)
            else:
                logger.warning("OpenRouter response is empty. Using default traits.")
                traits = extract_traits_from_ai_response("")
        else:
            logger.warning("Unexpected OpenRouter API response format. Using default traits.")
            traits = extract_traits_from_ai_response("")

    except requests.exceptions.RequestException as req_err:
        logger.error(f"OpenRouter API request failed: {req_err}")
        raise HTTPException(status_code=500, detail=f"API request failed: {req_err}")

    try:
        new_candidate = Candidate(
            name=candidate.name,
            email=candidate.email,
            openness=traits["openness"],
            conscientiousness=traits["conscientiousness"],
            extraversion=traits["extraversion"],
            agreeableness=traits["agreeableness"],
            neuroticism=traits["neuroticism"],
        )
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)

        await notify_recruiters({
            "event": "new_candidate",
            "data": {
                "name": new_candidate.name,
                "email": new_candidate.email,
                "personality_traits": traits,
            },
        })
        logger.info(f"Candidate {new_candidate.email} saved successfully.")

    except Exception as db_error:
        db.rollback()
        logger.error(f"Database error: {db_error}")
        raise HTTPException(status_code=500, detail=f"Database error: {db_error}")

    return {"message": "Response submitted successfully", "personality_traits": traits}


@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """Returns aggregated personality trait averages."""
    total_candidates = db.query(Candidate).count()
    if total_candidates == 0:
        return {"message": "No candidates found", "analytics": {}}

    averages = db.query(
        func.avg(Candidate.openness).label("openness"),
        func.avg(Candidate.conscientiousness).label("conscientiousness"),
        func.avg(Candidate.extraversion).label("extraversion"),
        func.avg(Candidate.agreeableness).label("agreeableness"),
        func.avg(Candidate.neuroticism).label("neuroticism")
    ).first()

    return {
        "openness": round(averages.openness, 2) if averages.openness else 0,
        "conscientiousness": round(averages.conscientiousness, 2) if averages.conscientiousness else 0,
        "extraversion": round(averages.extraversion, 2) if averages.extraversion else 0,
        "agreeableness": round(averages.agreeableness, 2) if averages.agreeableness else 0,
        "neuroticism": round(averages.neuroticism, 2) if averages.neuroticism else 0
    }


@router.get("/personality-profile")
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()
    return candidates


@router.get("/personality-profile")
def get_personality_profile(email: str, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.email == email).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return {
        "email": candidate.email,
        "openness": candidate.openness,
        "conscientiousness": candidate.conscientiousness,
        "extraversion": candidate.extraversion,
        "agreeableness": candidate.agreeableness,
        "neuroticism": candidate.neuroticism,
    }

