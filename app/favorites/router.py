from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import get_current_user
from app.favorites.services import (
    get_all_favorites,
    add_favorite,
    remove_favorite,
    is_favorite,
    filter_favorites_by_tags
)

router = APIRouter(prefix="/favorite-recipes", tags=["Favorite Recipes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 5.1 즐겨찾기 목록 조회
@router.get("")
def get_favorites(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    data = get_all_favorites(db, userId)
    return {"success": True, "data": data}


# 5.2 즐겨찾기 추가
@router.post("/{recipeId}")
def add(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    fav = add_favorite(db, userId, recipeId)
    return {"success": True, "data": {"recipeId": recipeId, "isFavorite": True}}


# 5.3 즐겨찾기 제거
@router.delete("/{recipeId}")
def delete(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    removed = remove_favorite(db, userId, recipeId)
    if not removed:
        raise HTTPException(status_code=404, detail="NOT_FAVORITED")
    return {"success": True, "message": "즐겨찾기에서 제거되었습니다"}


# 5.4 즐겨찾기 여부 확인
@router.get("/{recipeId}/check")
def check(recipeId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    result = is_favorite(db, userId, recipeId)
    return {"success": True, "data": {"isFavorite": result}}


# 5.5 태그 필터링
@router.post("/filter-by-tags")
def filter_by_tags(body: dict, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    tags = body.get("tags", [])
    data = filter_favorites_by_tags(db, userId, tags)
    return {"success": True, "data": data}

