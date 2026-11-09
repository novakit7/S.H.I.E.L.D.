
from pydantic import BaseModel, Field


class MatchingItem(BaseModel):
    id: str
    title: str
    description: str = ""
    category: str = ""
    location: str = ""
    date: str = ""


class MatchingRequest(BaseModel):
    query: MatchingItem
    candidates: list[MatchingItem] = Field(default_factory=list)
    limit: int = Field(default=5, ge=1, le=50)


class MatchResult(BaseModel):
    lost_item_id: str
    found_item_id: str
    similarity_score: float
    match_status: str = "POSSIBLE_MATCH"


class MatchingResponse(BaseModel):
    matches: list[MatchResult]
