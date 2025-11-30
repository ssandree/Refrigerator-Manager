from datetime import datetime, timedelta
from typing import Iterable, Optional, Set
import json

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.food.food_models import Food
from app.recipes.recipe_models import Recipe


def _extract_required_names(raw) -> Set[str]:
    """
    Recipe.requiredfoods 에서 재료 이름들만 뽑아서 set으로 리턴.
    - DB에는 JSON 문자열로 저장되어 있음.
    - 혹시 리스트/딕트로 들어오더라도 대응.
    """
    if not raw:
        return set()

    data = raw
    # 문자열이면 JSON 파싱 시도
    if isinstance(raw, str):
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            # JSON 아니고 그냥 "바나나, 계란" 이런 문자열일 수도 있음
            return {s.strip() for s in raw.split(",") if s.strip()}

    names: list[str] = []

    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                name = item.get("name")
                if name:
                    names.append(str(name))
            else:
                names.append(str(item))
    elif isinstance(data, dict):
        name = data.get("name")
        if name:
            names.append(str(name))
    else:
        names.append(str(data))

    return {n.strip() for n in names if n and n.strip()}


def get_all_recipes(db: Session, limit: int = 50, skip: int = 0):
    """
    전체 레시피 개수(total)와 일부만(limit) 잘라서 반환.
    """
    query = db.query(Recipe)

    total = query.count()
    recipes = (
        query
        # 필요하면 정렬 기준 추가 (예: 최신순)
        # .order_by(Recipe.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return total, recipes


def get_recipe_by_id(db: Session, recipe_id: str):
    return db.query(Recipe).filter(Recipe.id == recipe_id).first()


def search_recipes(db: Session, query: str):
    pattern = f"%{query}%"
    return (
        db.query(Recipe)
        .filter(
            or_(
                Recipe.recipeName.ilike(pattern),
                Recipe.requiredfoods.ilike(pattern),
            )
        )
        .all()
    )


def filter_recipes(
    db: Session,
    userId: str,
    ingredients: Optional[Iterable[str]] = None,
    expiring_only: bool = False,
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
    limit: int = 50,
):
    """
    필터 조건에 맞는 레시피 목록을 반환.
    마지막에 limit로 개수를 잘라서 돌려줌.
    """
    query = db.query(Recipe)

    # 칼로리 조건
    if min_calories is not None:
        query = query.filter(Recipe.calories >= min_calories)
    if max_calories is not None:
        query = query.filter(Recipe.calories <= max_calories)

    recipes = query.all()

    # ---- 재료 필터 ----
    if ingredients:
        normalized = {
            item.strip().lower()
            for item in ingredients
            if item and item.strip()
        }
        if normalized:
            filtered = []
            for recipe in recipes:
                names = _extract_required_names(recipe.requiredfoods)
                names_lower = {n.lower() for n in names}
                if normalized.issubset(names_lower):
                    filtered.append(recipe)
            recipes = filtered

    # ---- 임박 재료 필터 ----
    if expiring_only:
        today = datetime.utcnow().date()
        threshold = today + timedelta(days=3)

        expiring_foods = (
            db.query(Food)
            .filter(
                Food.userId == userId,
                Food.expiryDate.isnot(None),
                Food.expiryDate >= today,
                Food.expiryDate <= threshold,
            )
            .all()
        )
        expiring_names_lower = {f.name.lower() for f in expiring_foods if f.name}

        if not expiring_names_lower:
            recipes = []
        else:
            filtered = []
            for recipe in recipes:
                names = _extract_required_names(recipe.requiredfoods)
                names_lower = {n.lower() for n in names}
                if expiring_names_lower.intersection(names_lower):
                    filtered.append(recipe)
            recipes = filtered

    # ---- 결과 상한선 적용 ----
    if limit is not None and limit > 0:
        recipes = recipes[:limit]

    return recipes
