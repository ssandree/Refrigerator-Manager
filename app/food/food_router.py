from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.food.food_models import Food
from app.food.food_services import (
    create_food,
    get_all_with_filters,
    get_by_id,
    update_food,
    delete_food,
    bulk_delete_foods,
)

# -------------------------------------------------
# 요청 바디용 Pydantic 스키마
# -------------------------------------------------


class FoodCreate(BaseModel):
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    name: str
    quantity: Optional[int] = 1
    weight: Optional[float] = None
    purchaseDate: Optional[date] = None
    expiryDate: Optional[date] = None
    storageLocation: Optional[str] = None
    alertBeforeDays: Optional[int] = None


class FoodUpdate(BaseModel):
    imageUrl: Optional[str] = None
    category: Optional[str] = None
    name: Optional[str] = None
    quantity: Optional[int] = None
    weight: Optional[float] = None
    purchaseDate: Optional[date] = None
    expiryDate: Optional[date] = None
    storageLocation: Optional[str] = None
    alertBeforeDays: Optional[int] = None


class BulkDeleteRequest(BaseModel):
    ids: List[str]


# -------------------------------------------------
# Router 설정
#   ※ 만약 프론트에서 /ingredients 로 호출하고 있으면
#      prefix="/ingredients" 로만 바꿔주면 됨.
# -------------------------------------------------

router = APIRouter(
    prefix="/foods",
    tags=["Foods"],
)


# -------------------------------------------------
# 공통 응답 변환 함수
# -------------------------------------------------


def _to_food_response(food: Food) -> dict:
    return {
        "id": food.id,
        "userId": food.userId,
        "imageUrl": food.imageUrl,
        "category": food.category,
        "name": food.name,
        "quantity": food.quantity,
        "weight": food.weight,
        "registeredAt": food.registeredAt,
        "purchaseDate": food.purchaseDate,
        "expiryDate": food.expiryDate,
        "storageLocation": food.storageLocation,
        "alertBeforeDays": food.alertBeforeDays,
    }


# -------------------------------------------------
# Create : 식재료 추가 (같은 이름이면 quantity 합치기)
# -------------------------------------------------


@router.post("")
def create_my_food(
    body: FoodCreate,
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
):
    """
    - 같은 user + 같은 name 이면 → 새 row를 만들지 않고 quantity 를 합친다.
    - 그 로직은 food_services.create_food 에 있음.
    """
    food = create_food(db, userId, body)
    return {
        "success": True,
        "data": _to_food_response(food),
    }


# -------------------------------------------------
# Read : 내 식재료 목록 조회 (필터 옵션)
# -------------------------------------------------


@router.get("")
def list_my_foods(
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
    name: Optional[str] = Query(None, description="식재료 이름 부분 검색"),
    category: Optional[str] = Query(None, description="카테고리"),
    storageLocation: Optional[str] = Query(
        None,
        alias="storageLocation",
        description="보관 위치(냉장, 냉동, 실온 등)",
    ),
    expiringOnly: bool = Query(
        False,
        description="3일 이내 만료 예정인 재료만",
    ),
    expiredOnly: bool = Query(
        False,
        description="이미 만료된 재료만",
    ),
):
    foods = get_all_with_filters(
        db,
        userId=userId,
        name=name,
        category=category,
        storageLocation=storageLocation,
        expiringOnly=expiringOnly,
        expiredOnly=expiredOnly,
    )

    return {
        "success": True,
        "data": [_to_food_response(f) for f in foods],
    }


# -------------------------------------------------
# Read : 단건 조회
# -------------------------------------------------


@router.get("/{food_id}")
def get_my_food(
    food_id: str,
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
):
    food = get_by_id(db, userId, food_id)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")

    return {
        "success": True,
        "data": _to_food_response(food),
    }


# -------------------------------------------------
# Update : 식재료 수정
# -------------------------------------------------


@router.put("/{food_id}")
def update_my_food(
    food_id: str,
    body: FoodUpdate,
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
):
    food = update_food(db, userId, food_id, body)
    if not food:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")

    return {
        "success": True,
        "data": _to_food_response(food),
    }


# -------------------------------------------------
# Delete : 단건 삭제
# -------------------------------------------------


@router.delete("/{food_id}")
def delete_my_food(
    food_id: str,
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
):
    ok = delete_food(db, userId, food_id)
    if not ok:
        raise HTTPException(status_code=404, detail="FOOD_NOT_FOUND")

    return {
        "success": True,
        "message": "DELETED",
    }


# -------------------------------------------------
# Delete : 여러 개 한 번에 삭제 (옵션)
# -------------------------------------------------


@router.delete("")
def delete_my_foods_bulk(
    body: BulkDeleteRequest,
    db: Session = Depends(get_db),
    userId: str = Depends(get_current_user),
):
    deleted = bulk_delete_foods(db, userId, body.ids)
    return {
        "success": True,
        "message": f"DELETED_{deleted}",
    }
