import uvicorn
from dotenv import load_dotenv

# Load environment variables before importing other modules
load_dotenv()

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from routes.personality import router as personality_router
from starlette.websockets import WebSocketState
app = FastAPI()

# Enable CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include personality router
app.include_router(personality_router)

# WebSocket connection manager
# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: list[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)

# manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"message": "Personality Assessment API is running"}




@app.get("/get_results")
async def get_results(email: str = Query(..., description="User email to fetch results")):
    """
    Endpoint to fetch user results by email.
    """
    try:
        if not email.strip():
            raise HTTPException(status_code=400, detail="Email is required")

        # Placeholder response
        return {"message": "Results fetched successfully", "email": email}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected!")  # ✅ Connection log
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received from client: {data}")  # ✅ Logs incoming messages
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()

if __name__ == "__main__":
    print("Starting FastAPI server with WebSockets...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
