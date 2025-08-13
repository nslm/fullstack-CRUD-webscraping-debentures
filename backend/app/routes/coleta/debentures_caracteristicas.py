from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
from datetime import datetime, date
import redis.asyncio as Redis
from typing import Optional
import pytz
import json

from app.database.debentures_caracteristicas import insert_debenture_caracteristicas
from app.database.logs_caracteristicas import insert_logs_caracteristicas, select_all_logs_caracteristicas
from app.database.connection import get_db_connection
from app.scrapers import scraper_caracteristicas

router = APIRouter()

async def get_cache(request: Request, key: str, json_loads = True) -> Optional[dict]:
    r = request.app.state.r
    cached = await r.get(key)
    return (json.loads(cached) if json_loads else cached) if cached else None

async def set_cache(request: Request, job_id: str, message: str, expiration: int = 300):
    r = request.app.state.r
    await r.set(job_id, message, ex=expiration)

async def delete_cache(request: Request, key: str):
    r = request.app.state.r
    return await r.delete(key)

async def insert_logs(conn, status, start_time, volume):
    try:
        br_tz = pytz.timezone('America/Sao_Paulo')
        now_br = datetime.now(br_tz)
        duracao = (now_br - start_time).total_seconds()
        await insert_logs_caracteristicas(
        conn, 
        {
            "data_exec":now_br.strftime('%Y-%m-%d %H:%M:%S'), 
            "duracao":duracao, 
            "volume":volume, 
            "status_final":status}
        )
    except Exception as e:
        return f"Erro ao inserir log: {e}"
    return "Log Inserido com Sucesso"


@router.post("/start/")
async def add_caracteristicas_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    br_tz = pytz.timezone('America/Sao_Paulo')
    start_time = datetime.now(br_tz)
    data = await request.json()
    run_id = data["run_id"]
    job_id = f"scraping:debentures_caracteristicas:{run_id}"  
    await set_cache(request, job_id, "Coleta iniciada...")

    scraping = await scraper_caracteristicas()
    if scraping["status"] == "erro":
        await set_cache(request, job_id, "Erro na coleta.")
        e = str(scraping["detalhe"])
        resp = await insert_logs(conn, "Erro", start_time, None)
        if resp.startswith("Erro"):
            e += ' '
            e += str(resp)
        raise HTTPException(status_code=500, detail=e)
    
    await set_cache(request, job_id, "Inserindo na Base.")
    data = scraping["data"]
    try:
        result = await insert_debenture_caracteristicas(
            conn,
            data
        )
        await set_cache(request, job_id, "Dados atualizados com sucesso!")
        resp = await insert_logs(conn, "Sucesso", start_time, result["inserted"])
        await delete_cache(request, "get_all_debentures_cache")
        await delete_cache(request, "logs_debentures_caracteristicas_cache")
        return {"message": "Debentures publicas adicionadas com sucesso", "debentures": result, "log_status":resp}
    except Exception as e:
        e = str(e)
        await set_cache(request, job_id, "Erro ao tentar salvar na base.")
        resp = await insert_logs(conn, "Erro", start_time, None)
        if resp.startswith("Erro"):
            e += ' '
            e += str(resp)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{run_id}/")
async def scraping_status(request: Request, run_id: str):
    job_id = f"scraping:debentures_caracteristicas:{run_id}" 
    status = await get_cache(request, job_id, json_loads=False)
    return {"status": status or "Sem status"}

@router.get("/logs/")
async def all_logs_route(request:Request, conn: AsyncConnection = Depends(get_db_connection)):
    cache_key = "logs_debentures_caracteristicas_cache"
    if cached := await get_cache(request, cache_key):
        return cached
    try:
        debentures = await select_all_logs_caracteristicas(conn)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))