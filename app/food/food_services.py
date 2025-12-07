from datetime import date, timedelta
from typing import List, Optional, Any

from sqlalchemy.orm import Session

from app.food.food_models import Food
from app.core.datetime_utils import get_kst_now, get_kst_today
from app.food.food_schemas import FoodCreate


# -------------------------------------------------
# Create : 같은 이름이면 quantity 합치기
# -------------------------------------------------
def create_food(db: Session, userId: str, data: FoodCreate) -> Food:
    """
    같은 user + 같은 이름(name) + 같은 expiryDate 이면
    -> 새로 row를 추가하지 않고 quantity만 더해준다.
    expiryDate 가 다르면 별도의 food 로 저장한다.
    """

    # 이름 정규화
    norm_name = (data.name or "").strip()

    # 이름이 비어있는 경우 방어
    if not norm_name:
        raise ValueError("name은 비어 있을 수 없습니다.")

    # 들어온 expiryDate
    incoming_expiry = getattr(data, "expiryDate", None)

    # 같은 user + 같은 이름 + (같은 expiryDate 또는 둘 다 None) 인 기존 재료 찾기
    query = db.query(Food).filter(
        Food.userId == userId,
        Food.name == norm_name,
    )

    if incoming_expiry is None:
        # 둘 다 None 인 경우만 합치기
        query = query.filter(Food.expiryDate.is_(None))
    else:
        query = query.filter(Food.expiryDate == incoming_expiry)

    existing = query.first()

    # 들어온 quantity (None 방지)
    add_qty = data.quantity or 0

    if existing:
        # 수량 합치기
        existing.quantity = (existing.quantity or 0) + add_qty

        # 들어온 값이 있으면 몇 가지 필드는 최신 값으로 덮어쓰기 (선택)
        if getattr(data, "imageUrl", None) is not None:
            existing.imageUrl = data.imageUrl
        if getattr(data, "category", None) is not None:
            existing.category = data.category
        if getattr(data, "weight", None) is not None:
            existing.weight = data.weight
        if getattr(data, "purchaseDate", None) is not None:
            existing.purchaseDate = data.purchaseDate
        if getattr(data, "storageLocation", None) is not None:
            existing.storageLocation = data.storageLocation
        if getattr(data, "alertBeforeDays", None) is not None:
            existing.alertBeforeDays = data.alertBeforeDays

        # expiryDate 는 "같은 값"인 경우에만 여기로 들어온 거라 따로 안 바꿔도 됨
        # (만약 바꾸고 싶다면 existing.expiryDate = incoming_expiry 해도 동일)

        db.commit()
        db.refresh(existing)
        return existing

    # 없으면 새 Food 생성
    food = Food(
        userId=userId,
        imageUrl=getattr(data, "imageUrl", None),
        category=getattr(data, "category", None),
        name=norm_name,
        quantity=add_qty,
        weight=getattr(data, "weight", None),
        purchaseDate=getattr(data, "purchaseDate", None),
        expiryDate=incoming_expiry,
        storageLocation=getattr(data, "storageLocation", None),
        alertBeforeDays=getattr(data, "alertBeforeDays", None),
        registeredAt=getattr(data, "registeredAt", get_kst_now()),
    )
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


# -------------------------------------------------
# Read : 리스트 조회 (필터 optional)
#  - router 에서 어떤 필터 인자를 넘겨도 에러 안 나게 **filters 처리
# -------------------------------------------------
def get_all_with_filters(
    db: Session,
    userId: str,
    **filters,
) -> List[Food]:
    """
    유저의 식재료 목록 조회.
    기본적으로 userId 기준으로만 필터링하고,
    일부 자주 쓸만한 필터(name, category, storageLocation, expiringOnly 등)만 처리.
    나머지 필터 인자는 무시해도 됨.
    """

    query = db.query(Food).filter(Food.userId == userId)

    # 이름 부분검색
    name: Optional[str] = filters.get("name")
    if name:
        query = query.filter(Food.name.contains(name))

    # 카테고리
    category: Optional[str] = filters.get("category")
    if category:
        query = query.filter(Food.category == category)

    # 보관 위치
    storage_location: Optional[str] = (
        filters.get("storageLocation") or filters.get("storage_location")
    )
    if storage_location:
        query = query.filter(Food.storageLocation == storage_location)

    # 임박/만료 필터
    today = get_kst_today()
    expiring_only = filters.get("expiringOnly")
    expired_only = filters.get("expiredOnly")

    # expiringOnly: 오늘~3일 이내 만료
    if expiring_only:
        threshold = today + timedelta(days=3)
        query = query.filter(
            Food.expiryDate.isnot(None),
            Food.expiryDate >= today,
            Food.expiryDate <= threshold,
        )

    # expiredOnly: 이미 만료된 것
    if expired_only:
        query = query.filter(
            Food.expiryDate.isnot(None),
            Food.expiryDate < today,
        )

    # 정렬: 유통기한 → 이름
    # MySQL 이라 NULLS LAST 안 되어서, is_(None)를 먼저 써서 NULL 을 뒤로 빼는 트릭 사용
    query = query.order_by(
        Food.expiryDate.is_(None),  # False(0)=유효한 날짜 먼저, True(1)=NULL 나중
        Food.expiryDate.asc(),
        Food.name.asc(),
    )

    return query.all()


# -------------------------------------------------
# Read : 단건 조회
# -------------------------------------------------
def get_by_id(db: Session, userId: str, food_id: str) -> Optional[Food]:
    """
    특정 유저의 특정 food 한 건 조회
    """
    return (
        db.query(Food)
        .filter(Food.userId == userId, Food.id == food_id)
        .first()
    )


# -------------------------------------------------
# Update
# -------------------------------------------------
def update_food(db: Session, userId: str, food_id: str, data: Any) -> Optional[Food]:
    food = (
        db.query(Food)
        .filter(Food.userId == userId, Food.id == food_id)
        .first()
    )
    if not food:
        return None

    # 업데이트 가능한 필드들만 덮어쓰기
    for field in [
        "imageUrl",
        "category",
        "name",
        "quantity",
        "weight",
        "purchaseDate",
        "expiryDate",
        "storageLocation",
        "alertBeforeDays",
    ]:
        if hasattr(data, field):
            value = getattr(data, field)
            if value is not None:
                setattr(food, field, value)

    db.commit()
    db.refresh(food)
    return food


# -------------------------------------------------
# Delete (단건)
# -------------------------------------------------
def delete_food(db: Session, userId: str, food_id: str) -> bool:
    food = (
        db.query(Food)
        .filter(Food.userId == userId, Food.id == food_id)
        .first()
    )
    if not food:
        return False

    db.delete(food)
    db.commit()
    return True


# -------------------------------------------------
# Delete (Bulk)
#  - router 에서 bulk_delete_foods 이름으로 import 함
# -------------------------------------------------
def bulk_delete_foods(db: Session, userId: str, ids: List[str]) -> int:
    """
    ids 에 들어 있는 식재료들을 한 번에 삭제.
    삭제된 row 개수를 리턴.
    """
    if not ids:
        return 0

    q = db.query(Food).filter(Food.userId == userId, Food.id.in_(ids))
    count = q.count()
    q.delete(synchronize_session=False)
    db.commit()
    return count
