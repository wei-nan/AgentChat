import hashlib
import secrets
import string
from fastapi import Security, HTTPException, status, Depends
from fastapi.security import APIKeyHeader
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.participant import Participant

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def hash_api_key(api_key: str) -> str:
    return hashlib.sha256(api_key.encode()).hexdigest()

def generate_api_key() -> str:
    alphabet = string.ascii_letters + string.digits
    return "ac_live_" + ''.join(secrets.choice(alphabet) for _ in range(32))

async def get_current_participant(
    api_key: str = Security(api_key_header),
    db: AsyncSession = Depends(get_db)
) -> Participant:
    if not api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing API Key")
    hashed_key = hash_api_key(api_key)
    result = await db.execute(select(Participant).where(Participant.api_key == hashed_key))
    participant = result.scalars().first()
    if not participant:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")
    return participant
