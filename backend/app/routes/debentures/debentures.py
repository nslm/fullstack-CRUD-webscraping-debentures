from fastapi import APIRouter, Depends, HTTPException, Request
from psycopg import AsyncConnection
from datetime import datetime, date
import redis.asyncio as Redis
from typing import Optional
import json

from app.database.debentures_crud_caracteristicas import insert_debenture_caracteristicas, select_all_debenture_caracteristicas, update_debenture_caracteristicas, delete_debenture_caracteristicas
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


@router.post("/")
async def add_debenture_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    data = await request.json()
    data["situacao"] = "Registrado"
    try:
        result = await insert_debenture_caracteristicas(
            conn,
            data
        )
        await delete_cache(request, "get_all_debentures_cache")
        return {"message": "Debenture adicionada com sucesso", "debenture": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def all_debentures_route(request:Request, conn: AsyncConnection = Depends(get_db_connection)):
    cache_key = "get_all_debentures_cache"
    if cached := await get_cache(request, cache_key):
        return cached
    try:
        debentures = await select_all_debenture_caracteristicas(conn)
        await set_cache(request, cache_key, json.dumps(debentures, default=lambda obj: obj.isoformat() if isinstance(obj, (date, datetime)) else str(obj)), 1800)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{codigo}/")
async def update_debenture_route(
    codigo: str,
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    data = await request.json()
    try:
        result = await update_debenture_caracteristicas(
            conn,
            codigo=codigo,
            emissor=data["emissor"],
            vencimento=data["vencimento"],
            indice=data["indice"],
            taxa=data["taxa"]
        )
        if result is None:
            raise HTTPException(status_code=404, detail="Debenture não encontrada")
        await delete_cache(request, "get_all_debentures_cache")
        return {"message": "Debenture atualizada com sucesso", "debenture": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{codigo}/")
async def delete_debenture_route(
    codigo: str,
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    
    if not codigo:
        raise HTTPException(status_code=400, detail="Código é obrigatório para deletar")
    try:
        success = await delete_debenture_caracteristicas(conn, codigo)
        if not success:
            raise HTTPException(status_code=404, detail="Debenture não encontrada")
        await delete_cache(request, "get_all_debentures_cache")
        return {"message": "Debenture removida com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    