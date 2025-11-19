from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.auth.schemas import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from app.auth.services import register_user, login_user
from app.core.jwt import get_current_user

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user, token = register_user(db, data)
        return {
            "success": True,
            "data": {
                "user": UserResponse(**user.__dict__),
                "token": token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user, token = login_user(db, data)
        return {
            "success": True,
            "data": {
                "user": UserResponse(**user.__dict__),
                "token": token
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

