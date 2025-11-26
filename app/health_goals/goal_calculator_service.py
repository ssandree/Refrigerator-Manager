# app/health_goals/goal_calculator_service.py

from typing import Dict
from app.auth.auth_models import User
from app.statistics.statistics_service import calculate_tdee

def calc_1001(user: User) -> Dict[str, float]:
    """체중 유지"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.2
    protein_cal = protein * 4
    fat_cal = (tdee - protein_cal) * 0.3
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
    }

def calc_1002(user: User) -> Dict[str, float]:
    """체지방 감량"""
    tdee = calculate_tdee(user) - 300
    tdee = max(tdee, 1200)
    weight = user.weight or 70

    protein = (tdee * 0.25) / 4
    carbs = (tdee * 0.25) / 4
    fat = (tdee * 0.475) / 9

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs,
        "fat": fat,
    }

def calc_1003(user: User) -> Dict[str, float]:
    """단백질 보충"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70
    activity = getattr(user, 'activity_level', 1.55)

    protein = weight * (0.8 if activity <= 1.375 else 1.8)
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.5) / 4,
        "fat": (rest * 0.5) / 9,
    }

def calc_1004(user: User):
    """체중 증량"""
    tdee = calculate_tdee(user) + 300
    weight = user.weight or 70

    protein = weight * 1.9
    protein_cal = protein * 4
    fat_cal = tdee * 0.25
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
    }

def calc_1005(user: User):
    """혈당 관리"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.2
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.5) / 4,
        "fat": (rest * 0.5) / 9,
        "sodium": 2000,
    }

def calc_1006(user: User):
    """면역력 강화"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.4
    protein_cal = protein * 4
    fat_cal = tdee * 0.27
    carbs_cal = tdee - protein_cal - fat_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": carbs_cal / 4,
        "fat": fat_cal / 9,
        "vitamin_c": 150,
        "vitamin_d": 37.5,
        "zinc": 10,
    }

def calc_1007(user: User):
    """체력 유지/향상"""
    tdee = calculate_tdee(user)
    weight = user.weight or 70

    protein = weight * 1.6
    protein_cal = protein * 4
    rest = tdee - protein_cal

    return {
        "calories": tdee,
        "protein": protein,
        "carbohydrates": (rest * 0.6) / 4,
        "fat": (rest * 0.4) / 9,
    }


GOAL_CALCULATORS = {
    1001: calc_1001,
    1002: calc_1002,
    1003: calc_1003,
    1004: calc_1004,
    1005: calc_1005,
    1006: calc_1006,
    1007: calc_1007,
}
