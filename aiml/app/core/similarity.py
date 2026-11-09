

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime

model = SentenceTransformer("all-MiniLM-L6-v2")


def item_text(item: dict[str, str]) -> str:
    fields = ("title", "description", "category")
    return " ".join(
        str(item.get(field, "")) for field in fields
    )


def date_similarity(date1: str, date2: str) -> float | None:
    if not date1 or not date2:
        return None

    try:
        d1 = datetime.strptime(date1, "%Y-%m-%d")
        d2 = datetime.strptime(date2, "%Y-%m-%d")
    except ValueError:
        return None

    days = abs((d1 - d2).days)

    return max(0.0, 1 - days / 30)


def similarity_scores(
    query: dict[str, str],
    candidates: list[dict[str, str]]
) -> list[float]:

    if not candidates:
        return []

    texts = [
        item_text(query),
        *(item_text(candidate) for candidate in candidates)
    ]

    embeddings = model.encode(texts)

    text_scores = cosine_similarity(
        embeddings[0:1],
        embeddings[1:]
    ).flatten()

    final_scores = []

    for candidate, text_score in zip(candidates, text_scores):
        signals = [(0.85, float(text_score))]

        location1 = query.get("location", "").strip().lower()
        location2 = candidate.get("location", "").strip().lower()

        if location1 and location2:
            signals.append((0.10, float(location1 == location2)))

        date_score = date_similarity(
            query.get("date", ""),
            candidate.get("date", "")
        )

        if date_score is not None:
            signals.append((0.05, date_score))

        total_weight = sum(weight for weight, _ in signals)

        final_score = sum(
            weight * score for weight, score in signals
        ) / total_weight

        final_scores.append(final_score)

    return final_scores
