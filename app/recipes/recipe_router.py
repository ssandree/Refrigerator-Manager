from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeResponse,
    SingleRecipeResponse,
    RecipeListResponse,
    DeleteResponse
)
from app.recipes.recipe_services import (
    get_all_recipes,
    get_recipe_by_id,
    search_recipes,
    filter_by_tags,
    filter_by_difficulty,
    filter_by_time_category
)
from app.recipes.recommend_service import recommend_recipes

router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(db: Session = Depends(get_db)):
    recipes = get_all_recipes(db)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{recipe_id}", response_model=SingleRecipeResponse)
def find_one(recipe_id: str, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return SingleRecipeResponse(data=RecipeResponse.model_validate(recipe))


# -----------------------------
# Search
# -----------------------------
@router.get("/search/", response_model=RecipeListResponse)
def search(q: str = Query(...), db: Session = Depends(get_db)):
    recipes = search_recipes(db, q)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Filter by Tags
# -----------------------------
@router.get("/filter-by-tags", response_model=RecipeListResponse)
def filter_tags(
    tags: list[str] = Query(..., description="tags"), 
    db: Session = Depends(get_db)
):
    recipes = filter_by_tags(db, tags)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Filter by Difficulty
# -----------------------------
@router.get("/difficulty/{difficulty}", response_model=RecipeListResponse)
def by_difficulty(difficulty: str, db: Session = Depends(get_db)):
    recipes = filter_by_difficulty(db, difficulty)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Filter by Time Category
# -----------------------------
@router.get("/time/{time_category}", response_model=RecipeListResponse)
def by_time(time_category: str, db: Session = Depends(get_db)):
    recipes = filter_by_time_category(db, time_category)
    return RecipeListResponse(
        data=[RecipeResponse.model_validate(recipe) for recipe in recipes]
    )


# -----------------------------
# Recommend
# -----------------------------
@router.post("/recommend")
def recommend(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = recommend_recipes(db, userId)
    return {"success": True, "data": data}
