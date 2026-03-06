from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import json

from app.db.database import get_db
from app.models.room import Room
from app.models.message import Message
from app.models.participant import Participant
from app.core.security import hash_api_key
from app.services.websocket_manager import manager

router = APIRouter(tags=["websockets"])

async def get_participant_by_api_key(api_key: str, db: AsyncSession) -> Participant:
    if not api_key:
        return None
    hashed = hash_api_key(api_key)
    result = await db.execute(select(Participant).where(Participant.api_key == hashed))
    return result.scalars().first()

async def get_or_create_room(room_id: UUID, db: AsyncSession) -> Room:
    result = await db.execute(select(Room).where(Room.id == room_id))
    room = result.scalars().first()
    if not room:
        room = Room(id=room_id)
        db.add(room)
        await db.commit()
    return room

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    room_id: UUID,
    api_key: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    participant = await get_participant_by_api_key(api_key, db)
    if not participant:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    await get_or_create_room(room_id, db)

    room_str = str(room_id)
    await manager.connect(websocket, room_str)

    join_event = {
        "event": "participant.joined",
        "payload": {
            "participant_id": str(participant.id),
            "name": participant.name
        }
    }
    await manager.broadcast(join_event, room_str)

    connected_event = {
        "event": "system.connected",
        "payload": {
            "room_id": room_str,
            "participants": [{"participant_id": str(participant.id), "name": participant.name}]
        }
    }
    await websocket.send_text(json.dumps(connected_event))

    try:
        while True:
            data = await websocket.receive_text()
            try:
                event_data = json.loads(data)
            except json.JSONDecodeError:
                continue

            if event_data.get("event") == "message.create":
                payload = event_data.get("payload", {})
                content = payload.get("content")
                if content:
                    new_message = Message(
                        room_id=room_id,
                        author_id=participant.id,
                        content=content
                    )
                    db.add(new_message)
                    await db.commit()
                    await db.refresh(new_message)

                    msg_event = {
                        "event": "message.created",
                        "payload": {
                            "message_id": str(new_message.id),
                            "author_id": str(participant.id),
                            "author_name": participant.name,
                            "content": new_message.content,
                            "created_at": new_message.created_at.isoformat()
                        }
                    }
                    await manager.broadcast(msg_event, room_str)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_str)
        leave_event = {
            "event": "participant.left",
            "payload": {
                "participant_id": str(participant.id),
                "name": participant.name
            }
        }
        await manager.broadcast(leave_event, room_str)
