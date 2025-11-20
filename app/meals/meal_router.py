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
    get_all_meals,
    get_meals_by_date_range,
    get_meals_by_date,
    get_meal_by_id,
    create_meal,
    update_meal,
    delete_meal,
    get_meals_by_type,
    get_meals_by_recipe,
    get_statistics
)

router = APIRouter(
    prefix="/meals",
    tags=["Meals"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=MealListResponse)
def find_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_all_meals(db, userId)
    return MealListResponse(
        data=[MealResponse.model_validate(meal) for meal in meals]
    )


# -----------------------------
# Read - By Date Range
# -----------------------------
@router.get("/range", response_model=MealListResponse)
def find_by_range(
    startDate: str = Query(..., description="startDate"),
    endDate: str = Query(..., description="endDate"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    meals = get_meals_by_date_range(db, userId, startDate, endDate)
    return MealListResponse(
        data=[MealResponse.model_validate(meal) for meal in meals]
    )


# -----------------------------
# Read - By Date
# -----------------------------
@router.get("/date/{date}", response_model=MealListResponse)
def find_by_date(date: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    meals = get_meals_by_date(db, userId, date)
    return MealListResponse(
        data=[MealResponse.model_validate(meal) for meal in meals]
    )


# -----------------------------
# Read - By Type
# -----------------------------
@router.get("/type/{mealType}", response_model=MealListResponse)
def find_by_type(mealType: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    from app.meals.meal_constants import VALID_MEAL_TYPES
    if mealType not in VALID_MEAL_TYPES:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid mealType. Must be one of {VALID_MEAL_TYPES}"
        )
    meals = get_meals_by_type(db, userId, mealType)
    return MealListResponse(
        data=[MealResponse.model_validate(meal) for meal in meals]
    )


# -----------------------------
# Read - By Recipe
# -----------------------------
@router.get("/recipe/{recipeId}", response_model=MealListResponse)
def find_by_recipe(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    # 레시피 존재 여부 확인
    from app.meals.meal_services import validate_recipe_exists
    validate_recipe_exists(db, recipeId)
    
    meals = get_meals_by_recipe(db, userId, recipeId)
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
