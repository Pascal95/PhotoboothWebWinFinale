"""
Authentication router.
Returns the user's role based on the submitted password.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.config_service import load_config

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    role: str  # "admin" | "user"


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    config = load_config()

    if payload.password == config.get("mot_de_passe_admin"):
        return LoginResponse(role="admin")

    if payload.password == config.get("mot_de_passe_utilisateur"):
        return LoginResponse(role="user")

    raise HTTPException(status_code=401, detail="Mot de passe incorrect")
