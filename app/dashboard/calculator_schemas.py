from pydantic import BaseModel
from typing import Optional


class BMIRequest(BaseModel):
    weight: float  # kg
    height: float  # cm


class BMIResponse(BaseModel):
    bmi: float
    category: str


class BMRRequest(BaseModel):
    age: int
    sex: str  # "male" or "female"
    weight: float  # kg
    height: float  # cm


class TDEERequest(BaseModel):
    bmr: float
    activity_level: float  # 1.2, 1.375, 1.55, 1.725, 1.9


class BMRResponse(BaseModel):
    bmr: float


class TDEEResponse(BaseModel):
    tdee: float


class BaseResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None


class BMIResponseWrapper(BaseResponse):
    data: BMIResponse


class BMRResponseWrapper(BaseResponse):
    data: BMRResponse


class TDEEResponseWrapper(BaseResponse):
    data: TDEEResponse

