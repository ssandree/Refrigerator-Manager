import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.recipes.recipe_models import Recipe
from app.auth.dependencies import get_current_user
from app.recipes.recipe_schemas import (
    RecipeResponse,
    SingleRecipeResponse,
    RecipeListResponse,
    RecommendResponse,
)
from app.recipes.recipe_services import (
    get_all_recipes,
    get_recipe_by_id,
    search_recipes,
    filter_recipes as filter_recipes_service,
)
from app.recipes.recommend_service import recommend_recipes


router = APIRouter(
    prefix="/recipes",
    tags=["Recipes"],
    # 모든 레시피 API는 인증 필요
    dependencies=[Depends(get_current_user)],
)


# -----------------------------
# 내부 헬퍼: requiredfoods 정규화
# -----------------------------
def _normalize_requiredfoods(raw) -> List[str]:
    """
    DB의 requiredfoods 형태
      - None
      - 문자열(JSON)
      - 리스트(str / dict)
    를 항상 List[str] (재료 이름 리스트)로 변환.
    """
    if raw is None:
        return []

    # 이미 리스트인 경우
    if isinstance(raw, list):
        names: List[str] = []
        for item in raw:
            if isinstance(item, str):
                if item.strip():
                    names.append(item.strip())
            elif isinstance(item, dict):
                nm = item.get("name")
                if isinstance(nm, str) and nm.strip():
                    names.append(nm.strip())
        return names

    # 문자열인 경우 → JSON 파싱 시도
    if isinstance(raw, str):
        try:
            data = json.loads(raw)
        except Exception:
            # "바나나, 꿀, 버터" 같은 형태면 쉼표 기준 split
            return [
                s.strip()
                for s in raw.split(",")
                if isinstance(s, str) and s.strip()
            ]

        if isinstance(data, list):
            names: List[str] = []
            for item in data:
                if isinstance(item, str):
                    if item.strip():
                        names.append(item.strip())
                elif isinstance(item, dict):
                    nm = item.get("name")
                    if isinstance(nm, str) and nm.strip():
                        names.append(nm.strip())
            return names

    # 그 외 이상한 타입이면 빈 리스트 처리
    return []


def _to_recipe_response(recipe: Recipe) -> RecipeResponse:
    """
    SQLAlchemy Recipe 모델 → Pydantic RecipeResponse 로 변환.
    (requiredfoods는 항상 List[str]로 맞춰서 넘김)
    """
    data = {
        "id": str(recipe.id),
        "recipeName": recipe.recipeName,
        "calories": recipe.calories,
        "healthGoal": recipe.healthGoal,
        "imageUrl": recipe.imageUrl,
        "requiredfoods": _normalize_requiredfoods(recipe.requiredfoods),
        "carbohydrates": recipe.carbohydrates,
        "protein": recipe.protein,
        "fat": recipe.fat,
        "sodium": recipe.sodium,
        "vitamin_c": recipe.vitamin_c,
        "vitamin_d": recipe.vitamin_d,
        "zinc": recipe.zinc,
    }
    return RecipeResponse.model_validate(data)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(
    db: Session = Depends(get_db),
    limit: int = Query(
        50,
        ge=1,
        le=100,
        description="가져올 최대 레시피 개수 (기본 50)",
    ),
    skip: int = Query(
        0,
        ge=0,
        description="건너뛸 개수 (페이지네이션용)",
    ),
):
    total, recipes = get_all_recipes(db, limit=limit, skip=skip)
    return RecipeListResponse(
        total=total,
        data=[_to_recipe_response(recipe) for recipe in recipes],
    )


# -----------------------------
# Search
# -----------------------------
@router.get("/search/", response_model=RecipeListResponse)
def search(q: str = Query(...), db: Session = Depends(get_db)):
    recipes = search_recipes(db, q)
    return RecipeListResponse(
        total=len(recipes),
        data=[_to_recipe_response(recipe) for recipe in recipes],
    )


# -----------------------------
# Recommend
# -----------------------------
@router.get("/recommend", response_model=RecommendResponse)
def recommend(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="최대 추천 레시피 개수",
    ),
):
    data = recommend_recipes(db, userId, limit=limit)
    return RecommendResponse(success=True, data=data)


# -----------------------------
# Filter
# -----------------------------
@router.get("/filter")
def filter_recipes(
    ingredients: Optional[List[str]] = Query(
        default=None,
        description="이 재료들을 모두 포함하는 레시피만 조회",
    ),
    expiringOnly: bool = Query(
        default=False,
        description="임박 재료(3일 이내 만료) 포함 레시피만 조회",
    ),
    minCalories: Optional[int] = Query(
        default=None,
        ge=0,
        description="최소 칼로리",
    ),
    maxCalories: Optional[int] = Query(
        default=None,
        ge=0,
        description="최대 칼로리",
    ),
    limit: int = Query(
        50,
        ge=1,
        le=100,
        description="최대 레시피 개수 (기본 50)",
    ),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipes = filter_recipes_service(
        db=db,
        userId=userId,
        ingredients=ingredients,
        expiring_only=expiringOnly,
        min_calories=minCalories,
        max_calories=maxCalories,
        limit=limit,
    )

    # Pydantic 모델 → dict로 변환해서 순수 JSON 반환
    return {
        "success": True,
        "message": None,
        "total": len(recipes),
        "data": [
            _to_recipe_response(recipe).model_dump()
            for recipe in recipes
        ],
    }


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{recipe_id}", response_model=SingleRecipeResponse)
def find_one(recipe_id: str, db: Session = Depends(get_db)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")
    return SingleRecipeResponse(data=_to_recipe_response(recipe))
