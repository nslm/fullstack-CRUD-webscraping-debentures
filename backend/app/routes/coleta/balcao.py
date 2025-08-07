from fastapi import APIRouter
from app.scrapers import scraper_balcao

router = APIRouter()

@router.post("/api/coleta/balcao")
def balcao():
    pass
