from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models import User, UserSignup, UserSignin, AuthResponse
from db import get_session
from auth import hash_password, verify_password, create_token
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup", response_model=AuthResponse)
def signup(data: UserSignup, session: Session = Depends(get_session)):
    # Check if email already exists
    existing = session.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        id=str(uuid.uuid4()),
        email=data.email,
        name=data.name,
        hashed_password=hash_password(data.password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    token = create_token(user.id, user.email)
    return AuthResponse(token=token, user_id=user.id, name=user.name, email=user.email)

@router.post("/signin", response_model=AuthResponse)
def signin(data: UserSignin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_token(user.id, user.email)
    return AuthResponse(token=token, user_id=user.id, name=user.name, email=user.email)