from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import SessionLocal
from app.meals.services import *
from app.meals.schemas import MealCreate, MealUpdate, MealResponse
from app.core.jwt import get_current_user

router = APIRouter(prefix="/meals", tags=["Meals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 3.1 모든 식사 조회
@router.get("")
def all_meals(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_all_meals(db, userId)
    return {"success": True, "data": meals}


# 3.2 날짜 범위 조회
@router.get("/range")
def range_meals(
    startDate: str,
    endDate: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meals = get_meals_by_date_range(db, userId, startDate, endDate)
    return {"success": True, "data": meals}


# 3.3 특정 날짜 조회
@router.get("/date/{date}")
def date_meals(date: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_meals_by_date(db, userId, date)
    return {"success": True, "data": meals}


# 3.4 상세 조회
@router.get("/{mealId}")
def detail(mealId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")
    return {"success": True, "data": meal}


# 3.5 식사 등록
@router.post("")
def create(data: MealCreate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = create_meal(db, userId, data)
    return {"success": True, "data": meal}


# 3.6 수정
@router.put("/{mealId}")
def update(mealId: str, data: MealUpdate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")

    meal = update_meal(db, meal, data)
    return {"success": True, "data": meal}


# 3.7 삭제
@router.delete("/{mealId}")
def delete(mealId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")

    delete_meal(db, meal)
    return {"success": True, "message": "식사가 삭제되었습니다"}


# 3.8 식사 유형별 조회
@router.get("/type/{mealType}")
def type_meals(mealType: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_meals_by_type(db, userId, mealType)
    return {"success": True, "data": meals}


# 3.9 레시피별 조회
@router.get("/recipe/{recipeId}")
def recipe_meals(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_meals_by_recipe(db, userId, recipeId)
    return {"success": True, "data": meals}


# 3.10 통계
@router.get("/statistics")
def stats(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_statistics(db, userId)
    return {"success": True, "data": data}

