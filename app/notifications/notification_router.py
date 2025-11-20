from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth.dependencies import get_current_user
from app.notifications.notification_schemas import (
    NotificationResponse,
    SingleNotificationResponse,
    NotificationListResponse,
    DeleteResponse,
    UnreadCountResponse
)
from app.notifications.notification_services import (
    get_notifications,
    get_notification_by_id,
    mark_as_read,
    mark_all_as_read,
    delete_notification,
    get_unread_count,
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
    dependencies=[Depends(get_current_user)]
)


# -----------------------------
# Read - All
# -----------------------------
@router.get("", response_model=NotificationListResponse)
def find_all(
    read: bool | None = Query(None, description="read"),
    limit: int = Query(50, description="limit"),
    offset: int = Query(0, description="offset"),
    userId=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = get_notifications(db, userId, read, limit, offset)
    return NotificationListResponse(
        data=[NotificationResponse.model_validate(noti) for noti in notifications]
    )


# -----------------------------
# Read - One
# -----------------------------
@router.get("/{notiId}", response_model=SingleNotificationResponse)
def find_one(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    noti = get_notification_by_id(db, userId, notiId)
    if not noti:
        raise HTTPException(status_code=404, detail="NOTIFICATION_NOT_FOUND")

    return SingleNotificationResponse(data=NotificationResponse.model_validate(noti))


# -----------------------------
# Read - Unread Count
# -----------------------------
@router.get("/unread-count", response_model=UnreadCountResponse)
def unread_count(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    count = get_unread_count(db, userId)
    return UnreadCountResponse(data={"unreadCount": count})


# -----------------------------
# Update - Mark as Read
# -----------------------------
@router.patch("/{notiId}/read", response_model=SingleNotificationResponse)
def mark_read(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    noti = mark_as_read(db, userId, notiId)
    if not noti:
        raise HTTPException(status_code=404, detail="NOTIFICATION_NOT_FOUND")

    return SingleNotificationResponse(data=NotificationResponse.model_validate(noti))


# -----------------------------
# Update - Mark All as Read
# -----------------------------
@router.patch("/read-all")
def mark_all(userId=Depends(get_current_user), db: Session = Depends(get_db)):
    mark_all_as_read(db, userId)
    return {"success": True, "message": "모든 알림이 읽음 처리되었습니다"}


# -----------------------------
# Delete
# -----------------------------
@router.delete("/{notiId}", response_model=DeleteResponse)
def delete(notiId: str, userId=Depends(get_current_user), db: Session = Depends(get_db)):
    result = delete_notification(db, userId, notiId)
    if not result:
        raise HTTPException(status_code=404, detail="NOTIFICATION_NOT_FOUND")

    return DeleteResponse(message="알림이 삭제되었습니다")
