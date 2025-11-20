from enum import Enum


class StorageLocation(str, Enum):
    """보관 위치"""
    FRIDGE = "FRIDGE"
    FREEZER = "FREEZER"
    ROOM_TEMP = "ROOM_TEMP"


class IngredientCategory(str, Enum):
    """재료 카테고리"""
    MEAT = "MEAT"
    FISH = "FISH"
    VEGETABLE = "VEGETABLE"
    FRUIT = "FRUIT"
    DAIRY = "DAIRY"
    GRAIN = "GRAIN"
    SEASONING = "SEASONING"
    NOODLE = "NOODLE"
    SIDE = "SIDE"
    SEAFOOD = "SEAFOOD"
    NUT = "NUT"
    BREAD = "BREAD"
    RICE_CAKE = "RICE_CAKE"
    SAUCE = "SAUCE"
    FROZEN = "FROZEN"
    DRINK = "DRINK"
    INSTANT = "INSTANT"
    OTHER = "OTHER"


# 유효한 값 리스트 (검증용)
VALID_STORAGE_LOCATIONS = [loc.value for loc in StorageLocation]
VALID_INGREDIENT_CATEGORIES = [cat.value for cat in IngredientCategory]

