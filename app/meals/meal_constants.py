from enum import Enum


class MealType(str, Enum):
    """식사 유형"""
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


# 유효한 값 리스트 (검증용)
VALID_MEAL_TYPES = [meal_type.value for meal_type in MealType]

