import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.recipes.recipe_models import Recipe
from app.auth.dependencies import get_current_user
from app.auth.auth_models import User
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

from app.health_goals.goal_calculator_service import (
    calc_goal_match_for_recipe,
    GOAL_MATCH_THRESHOLD,
)
from app.health_goals.health_services import get_user_goals

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


def _to_recipe_response(recipe: Recipe, user=None, user_goals=None) -> RecipeResponse:
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
        "sourceUrl": recipe.sourceUrl,
        "requiredfoods": _normalize_requiredfoods(recipe.requiredfoods),
        "carbohydrates": recipe.carbohydrates,
        "protein": recipe.protein,
        "fat": recipe.fat,
        "sodium": recipe.sodium,
        "vitamin_c": recipe.vitamin_c,
        "vitamin_d": recipe.vitamin_d,
        "zinc": recipe.zinc,
    }
    # 건강 목표 매칭
    if user and user_goals:
        selected_goal_ids = [g["id"] for g in user_goals]
        goal_title_map = {g["id"]: g["title"] for g in user_goals}
        goal_scores = calc_goal_match_for_recipe(recipe, user, selected_goal_ids)

        matched = []
        for gid, score in goal_scores.items():
            if score >= GOAL_MATCH_THRESHOLD:
                matched.append({
                    "id": gid,
                    "title": goal_title_map.get(gid),
                    "score": round(score, 3)
                })

        data["matchedGoals"] = matched
    else:
        data["matchedGoals"] = []

    return RecipeResponse.model_validate(data)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=RecipeListResponse)
def find_all(
    db: Session = Depends(get_db),
    userId=Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    total, recipes = get_all_recipes(db, limit=limit, skip=skip)
    user_goals = get_user_goals(db, userId)
    user = db.query(User).filter(User.id == userId).first()

    return RecipeListResponse(
        total=total,
        data=[_to_recipe_response(r, user=user, user_goals=user_goals) for r in recipes],
    )

# -----------------------------
# Search
# -----------------------------
@router.get("/search", response_model=RecipeListResponse)
def search(
    q: str = Query(...),
    db: Session = Depends(get_db),
    userId=Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    recipes = search_recipes(db, q, limit=limit, skip=skip)
    user_goals = get_user_goals(db, userId)
    user = db.query(User).filter(User.id == userId).first()
    
    # 전체 검색 결과 개수를 구하기 위해 limit 없이 한 번 더 조회
    total_recipes = search_recipes(db, q, limit=None, skip=0)
    total = len(total_recipes)
    
    return RecipeListResponse(
        total=total,
        data=[_to_recipe_response(r, user=user, user_goals=user_goals) for r in recipes],
    )



# -----------------------------
# Recommend
# -----------------------------
@router.get("/recommend", response_model=RecommendResponse)
def recommend(
    userId=Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    skip: int = Query(0, ge=0),
):
    raw = recommend_recipes(db, userId, limit=limit, skip=skip)

    # raw 안의 scoreDetails.matchedGoals를 바깥으로 꺼낼 수 있음
    enriched = []
    for r in raw:
        enriched.append({
            **r,
            "matchedGoals": r["scoreDetails"].get("matchedGoals", [])
        })

    return RecommendResponse(success=True, data=enriched)



# -----------------------------
# Filter
# -----------------------------
@router.get("/filter")
def filter_recipes(
    ingredients: Optional[List[str]] = Query(default=None),
    expiringOnly: bool = False,
    minCalories: Optional[int] = None,
    maxCalories: Optional[int] = None,
    limit: int = 50,
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

    user_goals = get_user_goals(db, userId)
    user = db.query(User).filter(User.id == userId).first()

    return {
        "success": True,
        "message": None,
        "total": len(recipes),
        "data": [
            _to_recipe_response(r, user=user, user_goals=user_goals).model_dump()
            for r in recipes
        ],
    }



# -----------------------------
# Read - One
# -----------------------------
@router.get("/{recipe_id}", response_model=SingleRecipeResponse)
def find_one(recipe_id: str, db: Session = Depends(get_db), userId=Depends(get_current_user)):
    recipe = get_recipe_by_id(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="RECIPE_NOT_FOUND")

    user_goals = get_user_goals(db, userId)
    user = db.query(User).filter(User.id == userId).first()

    return SingleRecipeResponse(data=_to_recipe_response(recipe, user, user_goals))
