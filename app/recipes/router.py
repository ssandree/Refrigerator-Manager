from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.recipes.schemas import RecipeResponse
from app.recipes.services import (
    get_all_recipes,
    get_recipe_by_id,
    search_recipes,
    filter_by_tags,
    filter_by_difficulty,
    filter_by_time_category
)
from app.recipes.recommend_service import recommend_recipes
from app.core.jwt import get_current_user

router = APIRouter(prefix="/recipes", tags=["Recipes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 4.1 모든 레시피 조회
@router.get("", response_model=dict)
def get_recipes(db: Session = Depends(get_db)):
    recipes = get_all_recipes(db)
    return {"success": True, "data": recipes}


# 4.2 레시피 상세 조회
@router.get("/{recipe_id}", response_model=dict)
def get_recipe(recipe_id: str, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return {"success": True, "data": recipe}


# 4.3 검색
@router.get("/search/", response_model=dict)
def search(q: str = Query(...), db: Session = Depends(get_db)):
    recipes = search_recipes(db, q)
    return {"success": True, "data": recipes}


# 4.4 태그로 필터링 (POST)
@router.post("/filter-by-tags", response_model=dict)
def filter_tags(body: dict, db: Session = Depends(get_db)):
    tags = body.get("tags", [])
    recipes = filter_by_tags(db, tags)
    return {"success": True, "data": recipes}


# 4.5 난이도 필터
@router.get("/difficulty/{difficulty}", response_model=dict)
def by_difficulty(difficulty: str, db: Session = Depends(get_db)):
    recipes = filter_by_difficulty(db, difficulty)
    return {"success": True, "data": recipes}


# 4.6 시간 카테고리 필터
@router.get("/time/{time_category}", response_model=dict)
def by_time(time_category: str, db: Session = Depends(get_db)):
    recipes = filter_by_time_category(db, time_category)
    return {"success": True, "data": recipes}


# 레시피 추천
@router.post("/recommend")
def recommend(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = recommend_recipes(db, userId)
    return {"success": True, "data": data}

