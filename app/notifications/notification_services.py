from sqlalchemy.orm import Session
from app.notifications.notification_models import Notification

def get_notifications(db: Session, userId: str, read: bool | None, limit: int, offset: int):
    q = db.query(Notification).filter(Notification.userId == userId)

    if read is not None:
        q = q.filter(Notification.read == read)

    return q.order_by(Notification.createdAt.desc()).limit(limit).offset(offset).all()


def get_notification_by_id(db: Session, userId: str, notiId: str):
    return db.query(Notification).filter(
        Notification.id == notiId,
        Notification.userId == userId
    ).first()


def mark_as_read(db: Session, userId: str, notiId: str):
    noti = get_notification_by_id(db, userId, notiId)
    if not noti:
        return None

    noti.read = True
    db.commit()
    db.refresh(noti)
    return noti


def mark_all_as_read(db: Session, userId: str):
    db.query(Notification).filter(
        Notification.userId == userId,
        Notification.read == False
    ).update({"read": True})

    db.commit()
    return True


def delete_notification(db: Session, userId: str, notiId: str):
    noti = get_notification_by_id(db, userId, notiId)
    if not noti:
        return False

    db.delete(noti)
    db.commit()
    return True


def get_unread_count(db: Session, userId: str):
    return db.query(Notification).filter(
        Notification.userId == userId,
        Notification.read == False
    ).count()

