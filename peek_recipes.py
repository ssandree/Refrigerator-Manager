# peek_recipes.py

from sqlalchemy import MetaData, select, func
from app.core.database import engine

metadata = MetaData()
metadata.reflect(bind=engine)

recipes = metadata.tables["recipes"]

with engine.connect() as conn:
    total = conn.execute(
        select(func.count()).select_from(recipes)
    ).scalar_one()
    print("Total recipes:", total)

    rows = conn.execute(
        select(
            recipes.c.id,
            recipes.c.recipeName,
            recipes.c.calories
        ).limit(5)
    ).all()

    print("\nSample rows:")
    for r in rows:
        print(r)
