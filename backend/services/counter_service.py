import json
from constants import COUNTER_PATH


def get_count() -> int:
    if not COUNTER_PATH.exists():
        return 0
    with open(COUNTER_PATH, "r", encoding="utf-8") as f:
        return json.load(f).get("count", 0)


def increment(n: int = 1) -> int:
    count = get_count() + n
    with open(COUNTER_PATH, "w", encoding="utf-8") as f:
        json.dump({"count": count}, f)
    return count


def reset() -> int:
    with open(COUNTER_PATH, "w", encoding="utf-8") as f:
        json.dump({"count": 0}, f)
    return 0
