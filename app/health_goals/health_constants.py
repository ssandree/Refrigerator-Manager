# -----------------------------
# Health Goals Constants
# -----------------------------

# app/health_goals/health_constants.py

HEALTH_GOALS = [
    {"id": 1001, "title": "체중 유지"},
    {"id": 1002, "title": "체지방 감량"},
    {"id": 1003, "title": "단백질 보충"},
    {"id": 1004, "title": "체중 증량"},
    {"id": 1005, "title": "혈당 관리"},
    {"id": 1006, "title": "면역력 강화"},
    {"id": 1007, "title": "체력 유지/향상"},
]

VALID_HEALTH_GOAL_IDS = {g["id"] for g in HEALTH_GOALS}
