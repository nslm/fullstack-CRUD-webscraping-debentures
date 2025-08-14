from typing import Optional
from psycopg import AsyncConnection
from psycopg.rows import dict_row
from typing import Union, List, Dict

with open("app/querys/analitycs_debentures_balcao.sql") as f:
    queries = f.read().split("-- ")

select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()
select_query_codigos = [q for q in queries if q.startswith("SELECT2")][0][7:].strip()

    
# SELECT
async def select_debentures_balcao(
    conn: AsyncConnection,
    codigos: List[str],
    data_inicio: str,
    data_fim: str
    ) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query, (codigos, data_inicio, data_fim))
        return await cur.fetchall()
    
# SELECT CODIGOS
async def select_debentures_balcao_codigos(
    conn: AsyncConnection,
    ) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query_codigos)
        return await cur.fetchall()
   