from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Literal

class ParticipantCreate(BaseModel):
    name: str
    type: Literal['human', 'agent']

class ParticipantResponse(BaseModel):
    participant_id: UUID
    name: str
    api_key: str

class ParticipantInDB(BaseModel):
    id: UUID
    name: str
    type: str
    api_key: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
