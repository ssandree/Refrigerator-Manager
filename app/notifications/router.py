from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.jwt import get_current_user
from app.notifications.schemas import NotificationResponse
from app.notifications.services import (
    get_notifications,
    get_notification_by_id,
    mark_as_read,
    mark_all_as_read,
    delete_notification,
    get_unread_count,
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 7.1 알림 목록 조회
@router.get("")
def list_notifications(
    read: bool | None = None,
    limit: int = 50,
    offset: int = 0,
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = get_notifications(db, userId, read, limit, offset)
    return {"success": True, "data": notifications}


# 7.2 알림 상세 조회
@router.get("/{notiId}")
def detail_notification(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    noti = get_notification_by_id(db, userId, notiId)
    if not noti:
        raise HTTPException(404, "NOTIFICATION_NOT_FOUND")

    return {"success": True, "data": noti}


# 7.3 알림 읽음 처리
@router.patch("/{notiId}/read")
def mark_read(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    noti = mark_as_read(db, userId, notiId)
    if not noti:
        raise HTTPException(404, "NOTIFICATION_NOT_FOUND")

    return {"success": True, "data": noti}


# 7.4 모든 알림 읽음 처리
@router.patch("/read-all")
def mark_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    mark_all_as_read(db, userId)
    return {"success": True, "message": "모든 알림이 읽음 처리되었습니다"}


# 7.5 알림 삭제
@router.delete("/{notiId}")
def delete_notification_api(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    result = delete_notification(db, userId, notiId)
    if not result:
        raise HTTPException(404, "NOTIFICATION_NOT_FOUND")

    return {"success": True, "message": "알림이 삭제되었습니다"}


# 7.6 읽지 않은 알림 개수 조회
@router.get("/unread-count")
def unread_count(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    count = get_unread_count(db, userId)
    return {"success": True, "data": {"unreadCount": count}}

