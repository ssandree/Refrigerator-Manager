from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from jose import jwt
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """JWT 토큰을 검증하고 사용자 ID를 반환하는 의존성 함수"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if not payload:
            raise HTTPException(status_code=401, detail="INVALID_TOKEN")
        return payload["userId"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="INVALID_TOKEN")
