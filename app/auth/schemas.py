from pydantic import BaseModel, EmailStr

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

class AuthResponse(BaseModel):
    success: bool = True
    data: dict

