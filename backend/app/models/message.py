import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Uuid
from sqlalchemy.sql import func
from app.db.database import Base

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(Uuid(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    author_id = Column(Uuid(as_uuid=True), ForeignKey("participants.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
