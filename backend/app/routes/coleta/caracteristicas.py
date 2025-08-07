from fastapi import APIRouter
from app.scrapers import scraper_caracteristicas

router = APIRouter()

@router.post("/api/coleta/caracteristicas")
def caracteristicas():
    pass
