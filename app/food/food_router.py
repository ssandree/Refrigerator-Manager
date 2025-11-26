from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.food.food_services import (
    create_food,
    get_all_with_filters,
    get_by_id,
    update_food,
    delete_food,
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
# Read - All with Filters
# -----------------------------
@router.get("", response_model=FoodListResponse)
def find_all(
    category: str | None = Query(None, description="카테고리 필터"),
    location: str | None = Query(None, description="보관 장소 필터"),
    expired: bool | None = Query(None, description="만료 여부 (true/false)"),
    expiring: bool | None = Query(None, description="임박 여부"),
    sort: str | None = Query(None, description="정렬 (예: expiryDate ASC)"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    foods = get_all_with_filters(
        db, 
        userId, 
        category=category,
        location=location,
        expired=expired,
        expiring=expiring,
        sort=sort
    )
    return FoodListResponse(
        data=[FoodResponse.model_validate(food) for food in foods]
    )


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
# Delete - Bulk (먼저 정의해야 경로 충돌 방지)
# -----------------------------
@router.delete("", response_model=BulkDeleteResponse)
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

