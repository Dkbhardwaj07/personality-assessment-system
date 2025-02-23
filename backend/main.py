import uvicorn
from dotenv import load_dotenv

# Load environment variables before importing other modules
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.personality import router as personality_router

app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this as needed for your use case
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personality_router)

@app.get("/")
def read_root():
    return {"message": "Personality Assessment API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)