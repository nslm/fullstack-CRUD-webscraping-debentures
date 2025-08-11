from fastapi import APIRouter, Depends, HTTPException, Request, Query
from psycopg import AsyncConnection
from app.database.debentures import insert_debenture, select_all_debenture, update_debenture, delete_debenture
from app.database.connection import get_db_connection

router = APIRouter()


@router.post("/")
async def add_debenture_route(
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    data = await request.json()
    try:
        result = await insert_debenture(
            conn,
            data
        )
        return {"message": "Debenture adicionada com sucesso", "debenture": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def all_debentures_route(conn: AsyncConnection = Depends(get_db_connection)):
    try:
        debentures = await select_all_debenture(conn)
        return debentures
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{codigo}")
async def update_debenture_route(
    codigo: str,
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    data = await request.json()
    try:
        result = await update_debenture(
            conn,
            codigo=codigo,
            emissor=data["emissor"],
            vencimento=data["vencimento"],
            indice=data["indice"],
            taxa=data["taxa"]
        )
        if result is None:
            raise HTTPException(status_code=404, detail="Debenture não encontrada")
        return {"message": "Debenture atualizada com sucesso", "debenture": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{codigo}")
async def delete_debenture_route(
    codigo: str,
    request: Request,
    conn: AsyncConnection = Depends(get_db_connection)
):
    
    if not codigo:
        raise HTTPException(status_code=400, detail="Código é obrigatório para deletar")
    try:
        success = await delete_debenture(conn, codigo)
        if not success:
            raise HTTPException(status_code=404, detail="Debenture não encontrada")
        return {"message": "Debenture removida com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    