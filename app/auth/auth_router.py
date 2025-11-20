from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.auth_schemas import RegisterRequest, LoginRequest, AuthResponse
from app.auth.auth_services import register_user, login_user

router = APIRouter(prefix="/auth", tags=["Auth"])


# -----------------------------
# Register
# -----------------------------
@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    try:
        user, token = register_user(db, data)
        from app.auth.auth_schemas import UserResponse, AuthDataResponse
        user_response = UserResponse.model_validate(user)
        return AuthResponse(
            message="User registered successfully",
            data=AuthDataResponse(user=user_response, token=token)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# -----------------------------
# Login
# -----------------------------
@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user, token = login_user(db, data)
        from app.auth.auth_schemas import UserResponse, AuthDataResponse
        user_response = UserResponse.model_validate(user)
        return AuthResponse(
            message="Login successful",
            data=AuthDataResponse(user=user_response, token=token)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
