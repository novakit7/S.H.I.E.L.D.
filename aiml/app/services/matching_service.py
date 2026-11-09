
from app.api.schemas.matching_schema import (
    MatchResult,
    MatchingRequest,
    MatchingResponse,
)

from app.core.similarity import similarity_scores


def find_matches(request: MatchingRequest) -> MatchingResponse:

    query = request.query.model_dump()

    candidates = [
        candidate.model_dump()
        for candidate in request.candidates
    ]

    scores = similarity_scores(query, candidates)

    ranked = sorted(
        zip(request.candidates, scores),
        key=lambda result: result[1],
        reverse=True,
    )

    matches = []

    for candidate, score in ranked[:request.limit]:

        matches.append(
            MatchResult(
                lost_item_id=request.query.id,
                found_item_id=candidate.id,
                similarity_score=round(float(score), 4),
                match_status="POSSIBLE_MATCH",
            )
        )

    return MatchingResponse(matches=matches)
