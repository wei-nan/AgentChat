from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from app.db.database import get_db
from app.models.message import Message
from app.models.participant import Participant
from app.models.room import Room
from app.schemas.message import MessageResponse
from app.core.security import get_current_participant

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("/{room_id}/messages", response_model=List[MessageResponse])
async def get_room_messages(
    room_id: UUID,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_participant)
):
    result_room = await db.execute(select(Room).where(Room.id == room_id))
    if not result_room.scalars().first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
        
    query = (
        select(Message, Participant.name.label("author_name"))
        .join(Participant, Message.author_id == Participant.id)
        .where(Message.room_id == room_id)
        .order_by(Message.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    
    result = await db.execute(query)
    messages = []
    for msg, author_name in result:
        messages.append(MessageResponse(
            message_id=msg.id,
            room_id=msg.room_id,
            author_id=msg.author_id,
            author_name=author_name,
            content=msg.content,
            created_at=msg.created_at
        ))
        
    return messages[::-1]
