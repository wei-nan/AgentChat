from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    
class MessageCreate(MessageBase):
    room_id: UUID
    author_id: UUID

class MessageResponse(BaseModel):
    message_id: UUID
    room_id: UUID
    author_id: UUID
    author_name: str
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
