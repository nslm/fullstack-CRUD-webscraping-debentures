from typing import Optional
from psycopg import AsyncConnection
from psycopg.rows import dict_row
from typing import Union, List, Dict

with open("app/querys/logs_balcao.sql") as f:
    queries = f.read().split("-- ")

insert_query = [q for q in queries if q.startswith("INSERT")][0][6:].strip()
select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()

# INSERT
async def insert_logs_balcao(conn: AsyncConnection, data:Dict[str, Union[str, List[str], int, List[int]]]) -> dict:
    cols = ["data_exec", "data_inicio", "data_fim", "status_final"]
    values = [data.get(col) for col in cols]
    is_bulk = any(isinstance(v, list) for v in values)
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(insert_query, values)
        await conn.commit()
        return await cur.fetchone()

    
# SELECT
async def select_all_logs_balcao(conn: AsyncConnection) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query)
        return await cur.fetchall()
    