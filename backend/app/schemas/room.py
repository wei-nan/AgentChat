from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class RoomBase(BaseModel):
    name: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomInDB(RoomBase):
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
