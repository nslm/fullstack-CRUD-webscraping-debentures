from typing import Optional
from psycopg import AsyncConnection
from psycopg.rows import dict_row
from typing import Union, List, Dict

with open("app/querys/analitycs_debentures_caracteristicas.sql") as f:
    queries = f.read().split("-- ")

select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()

    
# SELECT
async def select_debentures_caracteristicas(
    conn: AsyncConnection,
    codigos: List[str]
    ) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query, (codigos,))
        return await cur.fetchall()
   