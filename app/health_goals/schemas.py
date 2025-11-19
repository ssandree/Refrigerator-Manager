from pydantic import BaseModel

class HealthGoalResponse(BaseModel):
    id: int
    title: str
    description: str | None
    icon: str | None
    color: str | None

    class Config:
        from_attributes = True


class SetUserGoalsRequest(BaseModel):
    goalIds: list[int]

