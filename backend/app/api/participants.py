from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from app.db.database import get_db
from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate, ParticipantResponse
from app.core.security import generate_api_key, hash_api_key

router = APIRouter(prefix="/participants", tags=["participants"])

@router.post("", response_model=ParticipantResponse, status_code=status.HTTP_201_CREATED)
async def register_participant(participant_in: ParticipantCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Participant).where(Participant.name == participant_in.name))
    if result.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Participant name already exists")
    
    raw_api_key = generate_api_key()
    hashed_api_key = hash_api_key(raw_api_key)
    
    new_participant = Participant(
        name=participant_in.name,
        type=participant_in.type,
        api_key=hashed_api_key
    )
    
    db.add(new_participant)
    try:
        await db.commit()
        await db.refresh(new_participant)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Participant name already exists")
    
    return ParticipantResponse(
        participant_id=new_participant.id,
        name=new_participant.name,
        api_key=raw_api_key
    )
