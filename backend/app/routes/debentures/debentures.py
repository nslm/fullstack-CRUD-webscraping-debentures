from fastapi import APIRouter, Depends, HTTPException, Request, Query
from psycopg import AsyncConnection
from app.database.debentures_caracteristicas import insert_debenture_caracteristicas, select_all_debenture_caracteristicas, update_debenture_caracteristicas, delete_debenture_caracteristicas
from app.database.connection import get_db_connection

router = APIRouter()


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
        return {"message": "Debenture adicionada com sucesso", "debenture": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def all_debentures_route(conn: AsyncConnection = Depends(get_db_connection)):
    try:
        debentures = await select_all_debenture_caracteristicas(conn)
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
        success = await delete_debenture_caracteristicas(conn, codigo)
        if not success:
            raise HTTPException(status_code=404, detail="Debenture não encontrada")
        return {"message": "Debenture removida com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    