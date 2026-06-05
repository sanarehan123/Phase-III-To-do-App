from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models import Task, TaskCreate, TaskUpdate, TaskResponse
from db import get_session
from auth import verify_token
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api", tags=["tasks"])

@router.get("/{user_id}/tasks", response_model=list[TaskResponse])
def get_tasks(
    user_id: str,
    status: Optional[str] = "all",
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    query = select(Task).where(Task.user_id == user_id)
    
    if status == "completed":
        query = query.where(Task.completed == True)
    elif status == "pending":
        query = query.where(Task.completed == False)
    
    tasks = session.exec(query).all()
    return tasks

@router.post("/{user_id}/tasks", response_model=TaskResponse)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    task = Task(user_id=user_id, **task_data.dict())
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    session.delete(task)
    session.commit()
    return {"message": "Task deleted"}

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    
    session.add(task)
    session.commit()
    session.refresh(task)
    return task