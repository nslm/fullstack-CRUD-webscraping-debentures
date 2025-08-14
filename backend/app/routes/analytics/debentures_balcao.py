from fastapi import APIRouter, Depends, HTTPException, Request, Query
from psycopg import AsyncConnection
from datetime import date, datetime
from typing import Optional
import json

from app.database.debentures_analytics_balcao import select_debentures_balcao, select_debentures_balcao_codigos
from app.database.connection import get_db_connection

router = APIRouter()

async def get_cache(request: Request, key: str) -> Optional[dict]:
    r = request.app.state.r
    cached = await r.get(key)
    return json.loads(cached) if cached else None

async def set_cache(request: Request, job_id: str, message: str, expiration: int = 300):
    r = request.app.state.r
    await r.set(job_id, message, ex=expiration)

async def delete_cache(request: Request, key: str):
    r = request.app.state.r
    return await r.delete(key)

@router.get("/")
async def analytics_evolucao_route(
    codigos: str = Query(..., description="Lista de códigos de ativos separados por vírgula"),
    data_inicio: date = Query(..., description="Data de início no formato YYYY-MM-DD"),
    data_fim: date = Query(..., description="Data de fim no formato YYYY-MM-DD"),
    request: Request = None,
    conn: AsyncConnection = Depends(get_db_connection)
    ):
    
    codigos_list = [c.strip().replace('"', '').replace("'",'') for c in codigos.split(",") if c.strip()] 
    if not codigos_list:
        raise HTTPException(
            status_code=400,
            detail="É necessário informar pelo menos um código de ativo."
        )
    
    if data_inicio > data_fim:
        raise HTTPException(status_code=500, detail="A Data Inicial deve ser a mesma ou anterior a Data Final.")
    
    cache_key = f"analytics_balcao_cache:codigos:{','.join(codigos_list)}-data_inicio:{data_inicio}-data_fim:{data_fim}"
    if cached := await get_cache(request, cache_key):
        return cached      
    try:
        data_inicio = data_inicio.strftime("%Y-%m-%d")
        data_fim = data_fim.strftime("%Y-%m-%d")

        debentures = await select_debentures_balcao(conn, codigos_list, data_inicio, data_fim)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/codigos/")
async def analytics_evolucao_route(
    request: Request = None,
    conn: AsyncConnection = Depends(get_db_connection)
    ):
        
    cache_key = f"analytics_balcao_codigos_cache"
    if cached := await get_cache(request, cache_key):
        return cached      
    try:
        debentures = await select_debentures_balcao_codigos(conn)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))