from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
from datetime import datetime, date
import redis.asyncio as Redis
from typing import Optional
import pytz
import json

from app.database.debentures_crud_balcao import insert_debenture_balcao, select_dates_debenture_balcao
from app.database.logs_coleta_balcao import insert_logs_balcao, select_all_logs_balcao
from app.database.connection import get_db_connection
from app.scrapers import scraper_balcao, scraper_last_workday, scraper_not_workday_list

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

async def insert_logs(conn, status, start_date, final_date):
    try:
        br_tz = pytz.timezone('America/Sao_Paulo')
        now_br = datetime.now(br_tz)
        await insert_logs_balcao(
        conn, 
        {
            "data_exec":now_br.strftime('%Y-%m-%d %H:%M:%S'), 
            "data_inicio":start_date, 
            "data_fim":final_date, 
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
    
    data = await request.json()
    run_id = data["run_id"]
    job_id = f"scraping:debentures_balcao:{run_id}"   
    await set_cache(request, job_id, "Coleta iniciada...")

    start_date = data["Start_Date"]
    final_date = data["Final_Date"]
    if start_date > final_date:
        await set_cache(request, job_id, "Erro na coleta.")
        resp = await insert_logs(conn, "Erro", start_date, final_date)
        raise HTTPException(status_code=500, detail="A Data Inicial deve ser a mesma ou anterior a Data Final.")
    
    scraping = await scraper_balcao(start_date, final_date)
    if scraping["status"] == "erro":
        await set_cache(request, job_id, "Erro na coleta.")
        e = str(scraping["detalhe"])
        resp = await insert_logs(conn, "Erro", start_date, final_date)
        if resp.startswith("Erro"):
            e += ' '
            e += str(resp)
        raise HTTPException(status_code=500, detail=e)
    
    await set_cache(request, job_id, "Inserindo na Base.")
    data = scraping["data"]
    try:
        result = await insert_debenture_balcao(
            conn,
            data
        )
        await set_cache(request, job_id, "Dados atualizados com sucesso!")
        resp = await insert_logs(conn, "Sucesso", start_date, final_date)
        await delete_cache(request,"logs_debentures_balcao_cache")
        await delete_cache(request,"balcao_dates_cache")
        return {"message": "Debentures publicas adicionadas com sucesso", "debentures": result, "log_status":resp}
    except Exception as e:
        e = str(e)
        await set_cache(request, job_id, "Erro ao tentar salvar na base.")
        resp = await insert_logs(conn, "Erro", start_date, final_date)
        if resp.startswith("Erro"):
            e += ' '
            e += str(resp)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{run_id}/")
async def scraping_status_route(request: Request, run_id: str):
    job_id = f"scraping:debentures_balcao:{run_id}"  
    status = await get_cache(request, job_id, json_loads=False)
    return {"status": status or "Sem status"}

@router.get("/logs/")
async def all_log_route(request:Request, conn: AsyncConnection = Depends(get_db_connection)):
    cache_key = "logs_debentures_balcao_cache"
    if cached := await get_cache(request, cache_key):
        return cached
    try:
        debentures = await select_all_logs_balcao(conn)
        #await set_cache(request, cache_key, json.dumps(debentures), 1800)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/dates/")
async def all_dates_route(request: Request, conn: AsyncConnection = Depends(get_db_connection)):
    cache_key = "balcao_dates_cache"
    if cached := await get_cache(request, cache_key):
        return cached
    
    try:
        all_dates_raw = await select_dates_debenture_balcao(conn)
        all_dates = [str(d["data_do_negocio"]) for d in all_dates_raw]
        await set_cache(request, cache_key, json.dumps({"dates": all_dates}), 1800)
        return {"dates": all_dates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/lastworkday/")
async def last_workday_route(request: Request):
    cache_key = "lastworkday_cache"
    if cached := await get_cache(request, cache_key):
        return cached
    
    try:
        scraping = await scraper_last_workday()
        if scraping["status"] == "erro":
            e = scraping["detalhe"]
            raise HTTPException(status_code=500, detail=e)
        await set_cache(request, cache_key, json.dumps({"last_workday": scraping["last_workday"]}), 1800)
        return {"last_workday":scraping["last_workday"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/notworkdaylist/")
async def last_workday_route(request: Request):
    cache_key = "notworkdaylist_cache"
    if cached := await get_cache(request, cache_key):
        return cached

    try:
        scraping = await scraper_not_workday_list()
        if scraping["status"] == "erro":
            e = scraping["detalhe"]
            raise HTTPException(status_code=500, detail=e)
        await set_cache(request, cache_key, json.dumps({"not_workday_list": scraping["not_workday_list"]}), 1800)
        return {"not_workday_list":scraping["not_workday_list"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

