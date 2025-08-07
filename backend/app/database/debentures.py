from typing import Optional
from psycopg import AsyncConnection
from psycopg.rows import dict_row

with open("app/querys/debentures.sql") as f:
    queries = f.read().split("-- ")

insert_query = [q for q in queries if q.startswith("INSERT")][0][6:].strip()
select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()
update_query = [q for q in queries if q.startswith("UPDATE")][0][6:].strip()
delete_query = [q for q in queries if q.startswith("DELETE")][0][6:].strip()


# INSERT
async def insert_debenture(conn: AsyncConnection, codigo:str, emissor:str, vencimento:str, indice:str, taxa:int) -> dict:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(
            insert_query,
            (codigo, emissor, vencimento, indice, taxa)
        )
        await conn.commit()
        return await cur.fetchone()
    
# SELECT
async def select_all_debenture(conn: AsyncConnection) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query)
        return await cur.fetchall()

# UPDATE
async def update_debenture(conn: AsyncConnection, codigo:str, emissor:str, vencimento:str, indice:str, taxa:int) -> Optional[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(
            update_query,
            (emissor, vencimento, indice, taxa, codigo)
        )
        await conn.commit()
        return cur.rowcount > 0


# DELETE
async def delete_debenture(conn: AsyncConnection, codigo: int) -> bool:
    async with conn.cursor() as cur:
        await cur.execute(delete_query, (codigo,))
        await conn.commit()
        return cur.rowcount > 0
