# app/health_goals/bmr_service.py

import math
from app.auth.auth_models import User

def calculate_bmr(user: User) -> float:
    weight = getattr(user, 'weight', None) or 70.0
    age = getattr(user, 'age', None) or 30
    sex = (getattr(user, 'sex', None) or 'male').lower()

    height = getattr(user, 'height', None)
    if not height:
        bmi = getattr(user, 'bmi', None) or 22.0
        height = math.sqrt(weight / bmi) * 100

    if sex in ['female', '여', '여성']:
        return max(10 * weight + 6.25 * height - 5 * age - 161, 0)
    else:
        return max(10 * weight + 6.25 * height - 5 * age + 5, 0)


def calculate_tdee(user: User) -> float:
    bmr = calculate_bmr(user)
    activity = getattr(user, 'activity_level', None) or 1.55

    if activity not in [1.2, 1.375, 1.55, 1.725, 1.9]:
        activity = 1.55

    return max(bmr * activity, 0)
