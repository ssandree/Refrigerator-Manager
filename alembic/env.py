from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

import os
import sys

# 프로젝트 루트 경로 설정: alembic/env.py 기준 상위 두 폴더 위
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# 이제 올바른 import가 가능
from app.core.database import Base

# 모든 모델 import (중요) - Alembic이 변경사항을 감지하려면 모든 모델을 import해야 함
from app.auth.auth_models import User
from app.food.food_models import Food
from app.meals.meal_models import Meal
from app.recipes.recipe_models import Recipe
from app.favorites.favorites_models import FavoriteRecipe
from app.health_goals.health_models import UserHealthGoal
from app.notifications.notification_models import Notification

# Alembic 설정 로드
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Base.metadata 연결
target_metadata = Base.metadata


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
