# print_schema.py

from app.core.database import Base, engine

# 👇 여기서 모델들이 정의된 모듈들을 IMPORT 해줘야
#    Base.metadata에 테이블들이 등록돼.
from app.auth import auth_models
from app.favorites import favorites_models
from app.food import food_models
from app.health_goals import health_models
from app.meals import meal_models
from app.notifications import notification_models
from app.recipes import recipe_models


def main():
    print("=== Engine URL ===")
    print(engine.url)

    print("\n=== Tables & Columns ===")
    if not Base.metadata.sorted_tables:
        print("(No tables found in Base.metadata)")
        return

    for table in Base.metadata.sorted_tables:
        print(f"\nTable: {table.name}")
        for col in table.columns:
            print(
                f"  {col.name:25} {str(col.type):20} "
                f"pk={col.primary_key} nullable={col.nullable}"
            )


if __name__ == "__main__":
    main()
