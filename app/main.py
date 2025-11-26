from fastapi import FastAPI
from app.core.database import Base, engine
from app.auth.auth_router import router as auth_router
from app.food.food_router import router as ingredients_router
from app.recipes.recipe_router import router as recipes_router
from app.meals.meal_router import router as meals_router
from app.favorites.favorites_router import router as favorites_router
from app.health_goals.health_router import router as health_goals_router
from app.notifications.notification_router import router as notifications_router
from app.dashboard.dashboard_router import router as dashboard_router
from app.statistics.statistics_router import router as statistics_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(ingredients_router)
app.include_router(recipes_router)
app.include_router(meals_router)
app.include_router(favorites_router)
app.include_router(health_goals_router)
app.include_router(notifications_router)
app.include_router(dashboard_router)
app.include_router(statistics_router)


@app.get("/")
def root():
    return {"message": "Refrigerator API is running!"}


from fastapi.middleware.cors import CORSMiddleware

origins = [
    "*",  # 개발 단계에서는 전체 허용
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
