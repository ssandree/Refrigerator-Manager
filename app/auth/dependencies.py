### dependencies.py
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from app.core.config import settings
from typing import Optional

# auto_error=False로 설정하여 헤더가 없어도 자동으로 401을 반환하지 않도록 함
auth_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(auth_scheme)
):
    """JWT 토큰을 검증하고 사용자 ID를 반환하는 의존성 함수"""
    # credentials가 None이면 Authorization 헤더가 없는 것
    if credentials is None:
        # Authorization 헤더 확인
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization header missing",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Bearer 접두사 확인 및 제거
        if not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization header format. Expected: Bearer <token>",
                headers={"WWW-Authenticate": "Bearer"},
            )
        token = auth_header.replace("Bearer ", "").strip()
    else:
        token = credentials.credentials
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("userId")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="INVALID_TOKEN",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"INVALID_TOKEN: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
