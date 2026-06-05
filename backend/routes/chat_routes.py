from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from models import Task
from db import get_session
from auth import verify_token
from pydantic import BaseModel
from typing import Optional
import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

router = APIRouter(prefix="/api", tags=["chat"])
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

class ChatRequest(BaseModel):
    message: str
    user_id: str

# --- Define Functions (MCP Tools) ---
functions = [
    {
        "name": "create_task",
        "description": "Create a new task for the user",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the task"
                },
                "description": {
                    "type": "string",
                    "description": "Optional description of the task"
                }
            },
            "required": ["title"]
        }
    },
    {
        "name": "list_tasks",
        "description": "List tasks for the user, optionally filtered by status",
        "parameters": {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "enum": ["all", "pending", "completed"],
                    "description": "Filter tasks by status"
                }
            },
            "required": []
        }
    },
    {
        "name": "delete_task",
        "description": "Delete a task by matching its title",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the task to delete"
                }
            },
            "required": ["title"]
        }
    },
    {
        "name": "complete_task",
        "description": "Mark a task as complete by matching its title",
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the task to mark complete"
                }
            },
            "required": ["title"]
        }
    }
]

# --- Execute the function ---
def execute_function(name: str, args: dict, user_id: str, session: Session):
    if name == "create_task":
        task = Task(
            user_id=user_id,
            title=args["title"],
            description=args.get("description"),
            completed=False
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        return f"Task '{task.title}' created successfully."

    elif name == "list_tasks":
        status = args.get("status", "all")
        query = select(Task).where(Task.user_id == user_id)
        if status == "completed":
            query = query.where(Task.completed == True)
        elif status == "pending":
            query = query.where(Task.completed == False)
        tasks = session.exec(query).all()
        if not tasks:
            return "You have no tasks."
        task_list = "\n".join([
            f"- {'✓' if t.completed else '○'} {t.title}"
            + (f": {t.description}" if t.description else "")
            for t in tasks
        ])
        return f"Here are your tasks:\n{task_list}"

    elif name == "delete_task":
        title = args["title"].lower()
        tasks = session.exec(
            select(Task).where(Task.user_id == user_id)
        ).all()
        matched = next(
            (t for t in tasks if title in t.title.lower()), None
        )
        if not matched:
            return f"No task found matching '{args['title']}'."
        session.delete(matched)
        session.commit()
        return f"Task '{matched.title}' deleted successfully."

    elif name == "complete_task":
        title = args["title"].lower()
        tasks = session.exec(
            select(Task).where(Task.user_id == user_id)
        ).all()
        matched = next(
            (t for t in tasks if title in t.title.lower()), None
        )
        if not matched:
            return f"No task found matching '{args['title']}'."
        matched.completed = True
        matched.updated_at = datetime.utcnow()
        session.add(matched)
        session.commit()
        return f"Task '{matched.title}' marked as complete!"

    return "Unknown function."


@router.post("/chat")
def chat(
    request: ChatRequest,
    session: Session = Depends(get_session),
    authenticated_user_id: str = Depends(verify_token)
):
    if request.user_id != authenticated_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful todo list assistant. "
                "Help the user manage their tasks. "
                "When the user wants to create, list, delete, or complete tasks, "
                "use the available functions. "
                "Be friendly and concise."
            )
        },
        {
            "role": "user",
            "content": request.message
        }
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        functions=functions,
        function_call="auto"
    )

    response_message = response.choices[0].message

    if response_message.function_call:
        func_name = response_message.function_call.name
        func_args = json.loads(response_message.function_call.arguments)

        func_result = execute_function(func_name, func_args, authenticated_user_id, session)

        messages.append({
            "role": "assistant",
            "content": None,
            "function_call": {
                "name": func_name,
                "arguments": response_message.function_call.arguments
            }
        })
        messages.append({
            "role": "function",
            "name": func_name,
            "content": func_result
        })

        final_response = client.chat.completions.create(
           model="llama-3.3-70b-versatile",
            messages=messages
        )

        return {
            "reply": final_response.choices[0].message.content,
            "action_taken": func_name
        }

    return {
        "reply": response_message.content,
        "action_taken": None
    }