from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.food.food_services import (
    create_food,
    get_all,
    get_by_id,
    update_food,
    delete_food,
    get_by_category,
    get_by_storage_location,
    get_expiring,
    get_expired,
    bulk_delete_foods
)
from app.food.food_schemas import (
    FoodCreate,
    FoodUpdate,
    FoodResponse,
    SingleFoodResponse,
    FoodListResponse,
    DeleteResponse,
    BulkDeleteRequest,
    BulkDeleteResponse
)
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/foods",
    tags=["Foods"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Create
# -----------------------------
@router.post("", response_model=SingleFoodResponse)
def create(data: FoodCreate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = create_food(db, userId, data)
    return SingleFoodResponse(data=FoodResponse.model_validate(food))


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=FoodListResponse)
def find_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    foods = get_all(db, userId)
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


# -----------------------------
# Filter - By Category
# -----------------------------
@router.get("/category/{category}", response_model=FoodListResponse)
def get_foods_by_category(
    category: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    foods = get_by_category(db, userId, category)
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


# -----------------------------
# Filter - By Storage Location
# -----------------------------
@router.get("/location/{location}", response_model=FoodListResponse)
def get_foods_by_storage_location(
    location: str,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    foods = get_by_storage_location(db, userId, location)
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


# -----------------------------
# Filter - Expiring Foods
# -----------------------------
@router.get("/expiring", response_model=FoodListResponse)
def get_expiring_foods(
    days: int = Query(..., description="만료까지 남은 일수"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    foods = get_expiring(db, userId, days)
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


# -----------------------------
# Filter - Expired Foods
# -----------------------------
@router.get("/expired", response_model=FoodListResponse)
def get_expired_foods(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    foods = get_expired(db, userId)
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{foodId}", response_model=SingleFoodResponse)
def find_one(foodId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    return SingleFoodResponse(data=FoodResponse.model_validate(food))


# -----------------------------
# Update
# -----------------------------
@router.put("/{foodId}", response_model=SingleFoodResponse)
def update(foodId: str, data: FoodUpdate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    
    updated_food = update_food(db, food, data)
    return SingleFoodResponse(data=FoodResponse.model_validate(updated_food))


# -----------------------------
# Delete - Single
# -----------------------------
@router.delete("/{foodId}", response_model=DeleteResponse)
def delete(foodId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    
    delete_food(db, food)
    return DeleteResponse(message="음식이 삭제되었습니다")


# -----------------------------
# Delete - Bulk
# -----------------------------
@router.delete("/bulk", response_model=BulkDeleteResponse)
def bulk_delete(
    data: BulkDeleteRequest,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not data.foodIds:
        raise HTTPException(status_code=400, detail="삭제할 음식 ID가 필요합니다")
    
    deleted_count = bulk_delete_foods(db, userId, data.foodIds)
    return BulkDeleteResponse(
        deletedCount=deleted_count,
        message=f"{deleted_count}개의 음식이 삭제되었습니다"
    )

