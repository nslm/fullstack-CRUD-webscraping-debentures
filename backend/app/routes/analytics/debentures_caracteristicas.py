from fastapi import APIRouter, Depends, HTTPException, Request, Query
from psycopg import AsyncConnection
from typing import Optional
from datetime import datetime, date
import json

from app.database.debentures_analytics_caracteristicas import select_debentures_caracteristicas
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
async def analytics_caracteristicas_route(
    codigos: str = Query(..., description="Lista de códigos de ativos separados por vírgula"),
    request: Request = None,
    conn: AsyncConnection = Depends(get_db_connection)
    ):
    codigos_list = [c.strip().replace('"', '').replace("'",'') for c in codigos.split(",") if c.strip()] 

    if not codigos_list:
        raise HTTPException(
            status_code=400,
            detail="É necessário informar pelo menos um código de ativo."
        )

    cache_key = f"analytics_caracteristicas_cache:codigos:{','.join(codigos_list)}"
    if cached := await get_cache(request, cache_key):
        return cached
    try:
        debentures = await select_debentures_caracteristicas(conn, codigos_list)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    