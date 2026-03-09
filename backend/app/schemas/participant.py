from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Literal

class ParticipantCreate(BaseModel):
    name: str
    password: str
    type: Literal['user', 'agent', 'admin']

class ParticipantResponse(BaseModel):
    id: UUID
    name: str
    type: str

class ParticipantInDB(BaseModel):
    id: UUID
    name: str
    type: str
    password_hash: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
