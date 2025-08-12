from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
import redis.asyncio as redis
from app.database.debentures_caracteristicas import insert_debenture_caracteristicas
from app.database.logs_caracteristicas import insert_logs_caracteristicas, select_all_logs_caracteristicas
from app.database.connection import get_db_connection
from app.scrapers import scraper_caracteristicas
from datetime import datetime
import pytz

router = APIRouter()

async def insert_logs(conn, status, start_time, volume):
    try:
        br_tz = pytz.timezone('America/Sao_Paulo')
        now_br = datetime.now(br_tz)
        duracao = (now_br - start_time).total_seconds()
        result = await insert_logs_caracteristicas(
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


@router.post("/start")
async def add_caracteristicas_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    br_tz = pytz.timezone('America/Sao_Paulo')
    start_time = datetime.now(br_tz)
    data = await request.json()
    run_id = data["run_id"]
    job_id = f"scraping:debentures_caracteristicas:{run_id}"  
    r = request.app.state.r
    await r.set(job_id, "Coleta iniciada...")

    scraping = await scraper_caracteristicas()
    if scraping["status"] == "erro":
        await r.set(job_id, "Erro na coleta.")
        e = scraping["detalhe"]
        resp = await insert_logs(conn, "Erro", start_time, None)
        if resp.startswith("Erro"):
            e += ' '
            e += resp
        raise HTTPException(status_code=500, detail=e)
    
    await r.set(job_id, "Inserindo na Base.")
    data = scraping["data"]
    try:
        result = await insert_debenture_caracteristicas(
            conn,
            data
        )
        await r.set(job_id, "Dados atualizados com sucesso!")
        resp = await insert_logs(conn, "Sucesso", start_time, result["inserted"])
        return {"message": "Debentures publicas adicionadas com sucesso", "debentures": result, "log_status":resp}
    except Exception as e:
        await r.set(job_id, "Erro ao tentar salvar na base.")
        resp = await insert_logs(conn, "Erro", start_time, None)
        if resp.startswith("Erro"):
            e += ' '
            e += resp
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{run_id}")
async def scraping_status(request: Request, run_id: str):
    job_id = f"scraping:debentures_caracteristicas:{run_id}" 
    r = request.app.state.r
    status = await r.get(job_id)
    return {"status": status or "Sem status"}

@router.get("/logs")
async def all_logs_route(conn: AsyncConnection = Depends(get_db_connection)):
    try:
        debentures = await select_all_logs_caracteristicas(conn)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))