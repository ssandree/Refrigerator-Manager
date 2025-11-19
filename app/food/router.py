from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.food.services import create_food, get_all, get_by_id, update_food, delete_food
from app.food.schemas import FoodCreate, FoodUpdate, FoodResponse
from app.core.jwt import get_current_user

router = APIRouter(prefix="/fridge/foods", tags=["Foods"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create
@router.post("", response_model=dict)
def create(data: FoodCreate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = create_food(db, userId, data)
    return {"success": True, "data": FoodResponse.model_validate(food)}

# Read - 전체 조회
@router.get("", response_model=dict)
def find_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    foods = get_all(db, userId)
    return {"success": True, "data": [FoodResponse.model_validate(food) for food in foods]}

# Read - 단일 조회
@router.get("/{foodId}", response_model=dict)
def find_one(foodId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    return {"success": True, "data": FoodResponse.model_validate(food)}

# Update
@router.put("/{foodId}", response_model=dict)
def update(foodId: str, data: FoodUpdate, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    
    updated_food = update_food(db, food, data)
    return {"success": True, "data": FoodResponse.model_validate(updated_food)}

# Delete
@router.delete("/{foodId}", response_model=dict)
def delete(foodId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    food = get_by_id(db, foodId, userId)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")
    
    delete_food(db, food)
    return {"success": True, "message": "음식이 삭제되었습니다"}

