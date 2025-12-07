"""
한국 시간(UTC+9) 관련 유틸리티 함수
"""
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

# 한국 시간대 (Asia/Seoul = UTC+9)
KST = ZoneInfo("Asia/Seoul")


def get_kst_now() -> datetime:
    """
    한국 시간(UTC+9)의 현재 datetime을 반환합니다.
    """
    return datetime.now(KST)


def get_kst_today() -> datetime.date:
    """
    한국 시간(UTC+9)의 오늘 날짜를 반환합니다.
    """
    return get_kst_now().date()


def get_kst_datetime() -> datetime:
    """
    한국 시간(UTC+9)의 현재 datetime을 반환합니다.
    (get_kst_now와 동일, 호환성을 위해 유지)
    """
    return get_kst_now()

