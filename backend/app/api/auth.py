from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
from app.db.database import get_db
from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate, ParticipantResponse
from app.core.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=ParticipantResponse, status_code=status.HTTP_201_CREATED)
async def register(participant_in: ParticipantCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Participant).where(Participant.name == participant_in.name))
    if result.scalars().first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Participant name already exists")
    
    hashed_password = get_password_hash(participant_in.password)
    
    new_participant = Participant(
        name=participant_in.name,
        type=participant_in.type,
        password_hash=hashed_password
    )
    
    db.add(new_participant)
    try:
        await db.commit()
        await db.refresh(new_participant)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Participant name already exists")
    
    return ParticipantResponse(
        id=new_participant.id,
        name=new_participant.name,
        type=new_participant.type
    )

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Participant).where(Participant.name == form_data.username))
    participant = result.scalars().first()
    if not participant or not verify_password(form_data.password, participant.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(participant.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
