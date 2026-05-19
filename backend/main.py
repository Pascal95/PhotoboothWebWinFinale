"""
FastAPI application entry point.
Registers all routers and mounts static file directories.

Start with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from constants import (
    ALLOWED_ORIGINS,
    API_PORT,
    EXPORTS_DIR,
    PHOTOS_DIR,
    STATIC_DIR,
    TEMPLATES_DIR,
    UPLOADS_DIR,
)
from routers import auth, camera, capture, config_router, print_router, session, templates, upload
from utils.path_utils import ensure_dir

# Ensure required directories exist before the app starts
for directory in [PHOTOS_DIR, EXPORTS_DIR, TEMPLATES_DIR, UPLOADS_DIR]:
    ensure_dir(directory)

app = FastAPI(title="Photobooth API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(capture.router)
app.include_router(session.router)
app.include_router(config_router.router)
app.include_router(print_router.router)
app.include_router(templates.router)
app.include_router(upload.router)
app.include_router(camera.router)

# Static file serving
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/templates", StaticFiles(directory=str(TEMPLATES_DIR)), name="templates")


@app.get("/health")
def health():
    return {"status": "ok"}
