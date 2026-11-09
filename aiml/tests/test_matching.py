
from app.core.similarity import similarity_scores


def test_similarity_scores_rank_related_items() -> None:
    query = {
        "title": "blue water bottle",
        "category": "bottle"
    }

    candidates = [
        {
            "title": "blue water bottle",
            "category": "bottle"
        },
        {
            "title": "student notebook",
            "category": "stationery"
        },
    ]

    scores = similarity_scores(query, candidates)

    assert scores[0] > scores[1]


def test_similarity_scores_with_different_wording() -> None:
    query = {
        "title": "mobile phone",
        "description": "I lost my black Samsung phone near the library"
    }

    candidates = [
        {
            "title": "smartphone",
            "description": "A black Samsung device was found near the library"
        },
        {
            "title": "notebook",
            "description": "A notebook was found in the classroom"
        },
    ]

    scores = similarity_scores(query, candidates)

    print("Related item score:", scores[0])
    print("Unrelated item score:", scores[1])

    assert scores[0] > scores[1]


def test_matching_without_lost_location() -> None:
    query = {
        "title": "black wallet",
        "description": "Leather wallet with college ID",
        "category": "accessories",
        "date": "2026-11-09"
    }

    candidates = [
        {
            "title": "black wallet",
            "description": "Found leather wallet with college ID",
            "category": "accessories",
            "location": "Library",
            "date": "2026-11-09"
        }
    ]

    scores = similarity_scores(query, candidates)

    assert len(scores) == 1
    assert scores[0] > 0.5


def test_matching_with_missing_dates_and_locations() -> None:
    query = {
        "title": "black backpack",
        "description": "Bag containing engineering books",
        "category": "bags"
    }

    candidates = [
        {
            "title": "black backpack",
            "description": "Found bag with engineering books",
            "category": "bags"
        }
    ]

    scores = similarity_scores(query, candidates)

    assert len(scores) == 1
    assert scores[0] > 0.5
