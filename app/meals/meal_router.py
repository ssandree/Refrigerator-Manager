from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.meals.meal_schemas import (
    MealCreate,
    MealUpdate,
    MealResponse,
    SingleMealResponse,
    MealListResponse,
    DeleteResponse
)
from app.meals.meal_services import (
    query_meals,
    get_meal_by_id,
    create_meal,
    update_meal,
    delete_meal,
    validate_recipe_exists,
    get_statistics,
)
from app.meals.meal_constants import VALID_MEAL_TYPES

router = APIRouter(
    prefix="/meals",
    tags=["Meals"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - Unified
# -----------------------------
@router.get("", response_model=MealListResponse)
def find_all(
    date: str | None = Query(None, description="특정 날짜 (YYYY-MM-DD)"),
    startDate: str | None = Query(None, alias="startDate", description="조회 기간 시작일"),
    endDate: str | None = Query(None, alias="endDate", description="조회 기간 종료일"),
    mealType: str | None = Query(
        None,
        alias="type",
        description="식사 타입 (breakfast, lunch, dinner, snack)",
    ),
    recipeId: str | None = Query(None, alias="recipeId", description="레시피 ID"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if mealType and mealType not in VALID_MEAL_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid mealType. Must be one of {VALID_MEAL_TYPES}",
        )

    if recipeId:
        validate_recipe_exists(db, recipeId)

    meals = query_meals(
        db=db,
        userId=userId,
        date=date,
        start_date=startDate,
        end_date=endDate,
        meal_type=mealType,
        recipe_id=recipeId,
    )
    return MealListResponse(
        data=[MealResponse.model_validate(meal) for meal in meals]
    )


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{mealId}", response_model=SingleMealResponse)
def find_one(mealId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")
    return SingleMealResponse(data=MealResponse.model_validate(meal))


# -----------------------------
# Create
# -----------------------------
@router.post("", response_model=SingleMealResponse)
def create(data: MealCreate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = create_meal(db, userId, data)
    return SingleMealResponse(data=MealResponse.model_validate(meal))


# -----------------------------
# Update
# -----------------------------
@router.put("/{mealId}", response_model=SingleMealResponse)
def update(mealId: str, data: MealUpdate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")

    updated_meal = update_meal(db, meal, data)
    return SingleMealResponse(data=MealResponse.model_validate(updated_meal))


# -----------------------------
# Delete
# -----------------------------
@router.delete("/{mealId}", response_model=DeleteResponse)
def delete(mealId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meal = get_meal_by_id(db, mealId, userId)
    if not meal:
        raise HTTPException(status_code=404, detail="MEAL_NOT_FOUND")

    delete_meal(db, meal)
    return DeleteResponse(message="식사가 삭제되었습니다")


# -----------------------------
# Statistics
# -----------------------------
@router.get("/statistics")
def stats(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_statistics(db, userId)
    return {"success": True, "data": data}
