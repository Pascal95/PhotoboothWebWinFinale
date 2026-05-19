"""
Configuration service.
Single source of truth for reading and writing config.json.
"""

import json
from typing import Any
from constants import CONFIG_PATH


def load_config() -> dict:
    """Read and return the full configuration from disk."""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def save_config(new_config: dict) -> None:
    """Persist a configuration dictionary to disk."""
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(new_config, f, indent=2, ensure_ascii=False)


def get(key: str, default: Any = None) -> Any:
    """Return a single config value by key, with an optional default."""
    return load_config().get(key, default)
