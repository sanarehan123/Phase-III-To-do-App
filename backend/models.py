from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: str = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- Request/Response Schemas ---

class TaskCreate(SQLModel):
    title: str
    description: Optional[str] = None

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TaskResponse(SQLModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

class UserSignup(SQLModel):
    name: str
    email: str
    password: str

class UserSignin(SQLModel):
    email: str
    password: str

class AuthResponse(SQLModel):
    token: str
    user_id: str
    name: str
    email: str