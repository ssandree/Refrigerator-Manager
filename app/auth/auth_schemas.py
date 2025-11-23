from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshRequest(BaseModel):
    token: str

class UserUpdateRequest(BaseModel):
    name: str | None = None
    age: int | None = None
    sex: str | None = None
    weight: float | None = None
    activityLevel: str | None = None
    bmi: float | None = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: int | None
    sex: str | None
    weight: float | None
    activityLevel: str | None
    bmi: float | None

    class Config:
        from_attributes = True


# -----------------------------
# Standard API Response Formats
# -----------------------------

class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class AuthDataResponse(BaseModel):
    user: UserResponse
    token: str


class AuthResponse(BaseResponse):
    data: AuthDataResponse

