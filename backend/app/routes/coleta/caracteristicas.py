from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
import redis.asyncio as redis
from app.database.debentures import insert_debenture
from app.database.connection import get_db_connection
from app.scrapers import scraper_caracteristicas


router = APIRouter()
job_id = "scraping:debentures"   

@router.post("/start")
async def add_caracteristicas_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    r = request.app.state.r
    await r.set(job_id, "Coleta iniciada...")

    scraping = await scraper_caracteristicas()
    if scraping["status"] == "erro":
        await r.set(job_id, "Erro na coleta.")
        raise HTTPException(status_code=500, detail=scraping["detalhe"])
    
    await r.set(job_id, "Inserindo na Base.")
    data = scraping["data"]
    try:
        result = await insert_debenture(
            conn,
            data
        )
        await r.set(job_id, "Dados atualizados com sucesso!")
        return {"message": "Debentures publicas adicionadas com sucesso", "debentures": result}
    except Exception as e:
        await r.set(job_id, "Erro ao tentar salvar na base.")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def scraping_status(request: Request,):
    r = request.app.state.r
    status = await r.get(job_id)
    return {"status": status or "Sem status"}