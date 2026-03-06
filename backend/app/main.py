from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import participants, rooms, websockets

app = FastAPI(title="AgentChat PoC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(participants.router)
app.include_router(rooms.router)
app.include_router(websockets.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
