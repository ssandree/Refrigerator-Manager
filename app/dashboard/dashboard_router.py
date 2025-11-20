from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.dashboard.dashboard_services import today_dashboard
from app.dashboard.recommendation_service import recommend_recipes
from app.dashboard.calculator_service import (
    calculate_bmi, 
    get_bmi_category,
    calculate_bmr,
    calculate_bmr_from_params,
    calculate_tdee_from_params
)
from app.dashboard.calculator_schemas import (
    BMIRequest,
    BMIResponse,
    BMRRequest,
    BMRResponse,
    TDEERequest,
    TDEEResponse
)
from app.auth.auth_models import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/today")
def today(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = today_dashboard(db, userId)
    return {"success": True, "message": None, "data": data}


@router.get("/recommendations")
def get_recommendations(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    사용자 맞춤 레시피 추천
    
    건강 목표, 보유 재료, 임박 재료 등을 종합하여 점수 높은 순으로 정렬된 레시피를 반환합니다.
    """
    recommendations = recommend_recipes(db, userId)
    return {"success": True, "message": None, "data": recommendations}


@router.post("/calculator/bmi")
def calculate_bmi_endpoint(request: BMIRequest):
    """
    BMI 계산
    
    weight: 체중 (kg)
    height: 키 (cm)
    """
    bmi = calculate_bmi(request.weight, request.height)
    category = get_bmi_category(bmi)
    return {
        "success": True,
        "message": None,
        "data": {
            "bmi": bmi,
            "category": category
        }
    }


@router.post("/calculator/bmr")
def calculate_bmr_endpoint(request: BMRRequest):
    """
    BMR 계산
    
    age: 나이
    sex: 성별 ("male" or "female")
    weight: 체중 (kg)
    height: 키 (cm)
    """
    bmr = calculate_bmr_from_params(request.age, request.sex, request.weight, request.height)
    return {
        "success": True,
        "message": None,
        "data": {
            "bmr": bmr
        }
    }


@router.get("/calculator/bmr/my")
def get_my_bmr(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    내 BMR 조회
    """
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="USER_NOT_FOUND")
    
    bmr = calculate_bmr(user)
    return {
        "success": True,
        "message": None,
        "data": {
            "bmr": bmr
        }
    }


@router.post("/calculator/tdee")
def calculate_tdee_endpoint(request: TDEERequest):
    """
    TDEE 계산
    
    bmr: 기초대사량
    activity_level: 활동지수 (1.2, 1.375, 1.55, 1.725, 1.9)
    """
    tdee = calculate_tdee_from_params(request.bmr, request.activity_level)
    return {
        "success": True,
        "message": None,
        "data": {
            "tdee": tdee
        }
    }


@router.get("/calculator/tdee/my")
def get_my_tdee(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    내 TDEE 조회
    """
    from app.health_goals.health_status_service import calculate_tdee
    
    user = db.query(User).filter(User.id == userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="USER_NOT_FOUND")
    
    tdee = calculate_tdee(user)
    return {
        "success": True,
        "message": None,
        "data": {
            "tdee": tdee
        }
    }

