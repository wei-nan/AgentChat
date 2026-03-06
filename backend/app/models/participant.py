import uuid
from sqlalchemy import Column, String, DateTime, Uuid
from sqlalchemy.sql import func
from app.db.database import Base

class Participant(Base):
    __tablename__ = "participants"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, unique=True)
    type = Column(String(50), nullable=False)
    api_key = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
