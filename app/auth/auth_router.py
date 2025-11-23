from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.auth_schemas import RegisterRequest, LoginRequest, AuthResponse, UserResponse, UserUpdateRequest, RefreshRequest
from app.auth.auth_services import register_user, login_user, get_current_user_info, update_user_info, delete_user, refresh_token

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


# -----------------------------
# Refresh Token
# -----------------------------
@router.post("/refresh", response_model=AuthResponse)
def refresh(data: RefreshRequest, db: Session = Depends(get_db)):
    """토큰 갱신 (만료된 토큰도 허용)"""
    try:
        user, new_token = refresh_token(db, data.token)
        from app.auth.auth_schemas import UserResponse, AuthDataResponse
        user_response = UserResponse.model_validate(user)
        return AuthResponse(
            message="Token refreshed successfully",
            data=AuthDataResponse(user=user_response, token=new_token)
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# -----------------------------
# Get Current User Info
# -----------------------------
@router.get("/me", response_model=UserResponse)
def get_me(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    """현재 로그인한 사용자 정보 조회"""
    try:
        user = get_current_user_info(db, userId)
        return UserResponse.model_validate(user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# -----------------------------
# Update User Info
# -----------------------------
@router.put("/user/{userId}", response_model=UserResponse)
def update_user(
    userId: str,
    data: UserUpdateRequest,
    currentUserId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """사용자 정보 수정 (본인만 수정 가능)"""
    # 본인만 수정 가능하도록 검증
    if userId != currentUserId:
        raise HTTPException(status_code=403, detail="FORBIDDEN")
    
    try:
        user = update_user_info(db, userId, data)
        return UserResponse.model_validate(user)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


# -----------------------------
# Delete User Account
# -----------------------------
@router.delete("/user/{userId}")
def delete_user_account(
    userId: str,
    currentUserId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """계정 삭제 (본인만 삭제 가능, 관련 데이터도 함께 삭제)"""
    # 본인만 삭제 가능하도록 검증
    if userId != currentUserId:
        raise HTTPException(status_code=403, detail="FORBIDDEN")
    
    try:
        delete_user(db, userId)
        return {"success": True, "message": "계정이 성공적으로 삭제되었습니다"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
