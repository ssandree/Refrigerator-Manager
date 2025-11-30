import json
import math
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.recipes.recipe_models import Recipe

def clean(value):
    """MySQL에서 허용되지 않는 NaN/inf/이상값을 None으로 변환"""
    if value is None:
        return None

    # 문자열 처리
    if isinstance(value, str):
        stripped = value.strip().lower()
        if stripped in ["nan", "inf", "-inf", "", "none"]:
            return None
        try:
            # 문자열인데 사실 숫자일 수도 있음
            value = float(value)
        except:
            return None  # 숫자로 못바꾸면 None 처리

    # float NaN 처리
    if isinstance(value, float) and math.isnan(value):
        return None

    return value

def seed_recipes(json_path: str):
    db: Session = SessionLocal()
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        print(f"총 {len(data)}개의 레시피를 DB에 삽입합니다...")

        for item in data:
            nutrition = item.get("nutrition", {})

            recipe = Recipe(
                id=str(item.get("recipe_id")),
                recipeName=item.get("title"),

                calories=clean(nutrition.get("kcal")),
                healthGoal=None,
                imageUrl=item.get("image_url"),

                requiredfoods=item.get("ingredients"),

                carbohydrates=clean(nutrition.get("carb_g")),
                protein=clean(nutrition.get("protein_g")),
                fat=clean(nutrition.get("fat_g")),
                sodium=clean(nutrition.get("sodium_g")),
                vitamin_c=clean(nutrition.get("vitc_g")),
                vitamin_d=clean(nutrition.get("vitd_g")),
                zinc=clean(nutrition.get("zinc_g")),
            )
            db.add(recipe)

        db.commit()
        print("🎉 모든 레시피 삽입 완료!")

    except Exception as e:
        print("⚠️ 오류 발생:", e)
        db.rollback()

    finally:
        db.close()

if __name__ == "__main__":
    seed_recipes("app/recipes/data/merged_recipes.json")
