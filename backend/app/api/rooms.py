from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID
from app.db.database import get_db
from app.models.message import Message
from app.models.participant import Participant
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomInDB
from app.schemas.message import MessageResponse
from app.core.security import get_current_participant

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=List[RoomInDB])
async def get_rooms(
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_participant)
):
    result = await db.execute(select(Room).order_by(Room.created_at.desc()))
    return result.scalars().all()

@router.post("", response_model=RoomInDB, status_code=status.HTTP_201_CREATED)
async def create_room(
    room_in: RoomCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Participant = Depends(get_current_participant)
):
    if current_user.type not in ["agent", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents or admins can create rooms"
        )
    
    new_room = Room(name=room_in.name)
    db.add(new_room)
    await db.commit()
    await db.refresh(new_room)
    return new_room


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
