from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int | None = None
    sex: str | None = None
    bmi: float | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: int | None
    sex: str | None
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

