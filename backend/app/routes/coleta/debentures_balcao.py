from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
import redis.asyncio as redis
from app.database.debentures_balcao import insert_debenture_balcao, select_dates_debenture_balcao
from app.database.logs_balcao import insert_logs_balcao, select_all_logs_balcao
from app.database.connection import get_db_connection
from app.scrapers import scraper_balcao, scraper_last_workday
from datetime import datetime
import pytz

router = APIRouter()

async def insert_logs(conn, status, start_date, final_date):
    try:
        br_tz = pytz.timezone('America/Sao_Paulo')
        now_br = datetime.now(br_tz)
        result = await insert_logs_balcao(
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

@router.post("/start")
async def add_caracteristicas_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    
    data = await request.json()
    run_id = data["run_id"]
    job_id = f"scraping:debentures_balcao:{run_id}"   
    r = request.app.state.r
    await r.set(job_id, "Coleta iniciada...")

    start_date = data["Start_Date"]
    final_date = data["Final_Date"]
    scraping = await scraper_balcao(start_date, final_date)
    if scraping["status"] == "erro":
        await r.set(job_id, "Erro na coleta.")
        e = scraping["detalhe"]
        resp = await insert_logs(conn, "Erro", start_date, final_date)
        if resp.startswith("Erro"):
            e += ' '
            e += resp
        raise HTTPException(status_code=500, detail=e)
    
    await r.set(job_id, "Inserindo na Base.")
    data = scraping["data"]
    try:
        result = await insert_debenture_balcao(
            conn,
            data
        )
        await r.set(job_id, "Dados atualizados com sucesso!")
        resp = await insert_logs(conn, "Sucesso", start_date, final_date)
        return {"message": "Debentures publicas adicionadas com sucesso", "debentures": result, "log_status":resp}
    except Exception as e:
        await r.set(job_id, "Erro ao tentar salvar na base.")
        resp = await insert_logs(conn, "Erro", start_date, final_date)
        if resp.startswith("Erro"):
            e += ' '
            e += resp
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{run_id}")
async def scraping_status(request: Request, run_id: str):
    job_id = f"scraping:debentures_balcao:{run_id}"  
    r = request.app.state.r
    status = await r.get(job_id)
    return {"status": status or "Sem status"}

@router.get("/logs")
async def all_log_route(conn: AsyncConnection = Depends(get_db_connection)):
    try:
        debentures = await select_all_logs_balcao(conn)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/dates")
async def all_dates_route(conn: AsyncConnection = Depends(get_db_connection)):
    try:
        all_dates_raw = await select_dates_debenture_balcao(conn)
        all_dates = [d["data_do_negocio"] for d in all_dates_raw]
        return {"dates": all_dates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/lastworkday")
async def last_workday_route():
    try:
        scraping = await scraper_last_workday()
        if scraping["status"] == "erro":
            e = scraping["detalhe"]
            raise HTTPException(status_code=500, detail=e)
        return {"last_workday":scraping["last_workday"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

