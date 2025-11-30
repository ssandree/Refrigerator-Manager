#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
recipes_with_nutrition_v40_updated 디렉토리 안의
recipe_*.json 파일들을 읽어서 MySQL의 recipes 테이블에 넣는 스크립트.

- 이미 존재하는 id는 건너뜀
- title이 없거나 NaN이면 레코드 건너뜀 (로그만 남김)
- 영양 정보(NaN, None)는 안전하게 처리해서 넣음
"""

import os
import json
import math
from pathlib import Path

from sqlalchemy import MetaData, Table, select, insert
from sqlalchemy.orm import sessionmaker

# FastAPI 프로젝트의 DB 설정 재사용
from app.core.database import engine


# 🔧 여기 경로만 네 환경에 맞게 필요하면 수정하면 돼
JSON_DIR = Path(
    "/Users/yuhyeren/Downloads/fooddb-starter 복사본/"
    "out_20250930_1047_19433/recipes_with_nutrition_v40_updated"
)


def safe_float(x, default=None):
    """NaN / None 등을 안전하게 처리해서 float 또는 default로 리턴."""
    if x is None:
        return default
    if isinstance(x, float) and math.isnan(x):
        return default
    return float(x)


def load_json_files(json_dir: Path):
    """recipe_*.json 파일 경로 리스트 리턴 (정렬된 순서)."""
    files = sorted(json_dir.glob("recipe_*.json"))
    return files


def main():
    if not JSON_DIR.exists():
        print(f"[ERROR] JSON 디렉토리를 찾을 수 없음: {JSON_DIR}")
        return

    files = load_json_files(JSON_DIR)
    print(f"Found {len(files)} json files in {JSON_DIR}")

    # SQLAlchemy 설정 (기존 DB 엔진 재사용)
    metadata = MetaData()
    metadata.reflect(bind=engine)

    if "recipes" not in metadata.tables:
        print("[ERROR] 'recipes' 테이블을 찾을 수 없습니다. "
              "alembic으로 마이그레이션이 되었는지 확인해 주세요.")
        return

    recipes_table = metadata.tables["recipes"]

    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    session = SessionLocal()

    inserted = 0
    skipped_missing_title = 0
    skipped_error = 0
    skipped_existing = 0

    try:
        for idx, file_path in enumerate(files, start=1):
            try:
                with file_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)
            except Exception as e:
                print(f"[WARN] JSON 파싱 실패: {file_path.name} -> {e}")
                skipped_error += 1
                session.rollback()
                continue

            recipe_id = data.get("recipe_id")
            title = data.get("title")
            image_url = data.get("image_url")
            nutrition = data.get("nutrition") or {}
            ingredients = data.get("ingredients") or []

            # ✅ title(=recipeName) 방어: None, NaN, 빈 문자열이면 스킵
            if title is None or (
                isinstance(title, float) and math.isnan(title)
            ) or str(title).strip() == "":
                print(
                    f"[SKIP] recipe_id={recipe_id} : title이 비어있거나 NaN이라 건너뜀"
                )
                skipped_missing_title += 1
                session.rollback()
                continue

            # 이미 존재하는 id면 스킵
            existing = session.execute(
                select(recipes_table.c.id).where(
                    recipes_table.c.id == str(recipe_id)
                )
            ).first()

            if existing:
                # 이미 들어간 적 있으면 그냥 건너뛰기
                skipped_existing += 1
                session.rollback()
                continue

            # 영양 정보 안전 처리
            calories = safe_float(nutrition.get("kcal"), default=0) or 0
            carbohydrates = safe_float(nutrition.get("carb_g"))
            protein = safe_float(nutrition.get("protein_g"))
            fat = safe_float(nutrition.get("fat_g"))
            sodium = safe_float(nutrition.get("sodium_g"))
            vitamin_c = safe_float(nutrition.get("vitc_g"))
            vitamin_d = safe_float(nutrition.get("vitd_g"))
            zinc = safe_float(nutrition.get("zinc_g"))

            # 재료 리스트를 JSON으로 저장 (MySQL JSON 컬럼)
            try:
                requiredfoods_json = (
                    json.dumps(ingredients, ensure_ascii=False)
                    if ingredients
                    else None
                )
            except Exception as e:
                print(
                    f"[WARN] ingredients JSON 직렬화 실패: "
                    f"recipe_id={recipe_id}, file={file_path.name} -> {e}"
                )
                requiredfoods_json = None

            row = {
                "id": str(recipe_id),
                "recipeName": str(title),
                "calories": int(calories),
                "healthGoal": None,
                "imageUrl": image_url,
                "requiredfoods": requiredfoods_json,
                "carbohydrates": carbohydrates,
                "protein": protein,
                "fat": fat,
                "sodium": sodium,
                "vitamin_c": vitamin_c,
                "vitamin_d": vitamin_d,
                "zinc": zinc,
            }

            try:
                session.execute(insert(recipes_table).values(**row))
                session.commit()
                inserted += 1

                # 가끔 진행 상황 찍어주기
                if inserted % 500 == 0:
                    print(
                        f"[PROGRESS] {idx}/{len(files)} files processed, "
                        f"{inserted} inserted"
                    )
            except Exception as e:
                session.rollback()
                skipped_error += 1
                print(
                    f"[ERROR] INSERT 실패: recipe_id={recipe_id}, "
                    f"file={file_path.name} -> {e}"
                )
                # 문제 있는 레코드는 건너뛰고 계속 진행

        print("\n=== Import finished ===")
        print(f"총 파일 수         : {len(files)}")
        print(f"성공적으로 insert : {inserted}")
        print(f"제목 없음으로 skip : {skipped_missing_title}")
        print(f"이미 존재해서 skip : {skipped_existing}")
        print(f"에러로 skip        : {skipped_error}")

    finally:
        session.close()


if __name__ == "__main__":
    main()
