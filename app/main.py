from fastapi import FastAPI
from app.core.database import Base, engine
from app.auth.router import router as auth_router
from app.food.router import router as ingredients_router
from app.recipes.router import router as recipes_router
from app.meals.router import router as meals_router
from app.favorites.router import router as favorites_router
from app.health_goals.router import router as health_goals_router
from app.health_goals.stats_router import router as health_stats_router
from app.notifications.router import router as notifications_router
from app.dashboard.router import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(ingredients_router)
app.include_router(recipes_router)
app.include_router(meals_router)
app.include_router(favorites_router)
app.include_router(health_goals_router)
app.include_router(health_stats_router)
app.include_router(notifications_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "Refrigerator API is running!"}
