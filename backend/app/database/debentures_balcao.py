from typing import Optional
from psycopg import AsyncConnection
from psycopg.rows import dict_row
from typing import Union, List, Dict


with open("app/querys/debentures_balcao.sql") as f:
    queries = f.read().split("-- ")

insert_query = [q for q in queries if q.startswith("INSERT")][0][6:].strip()
select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()
select_query = [q for q in queries if q.startswith("LDATES")][0][6:].strip()


# INSERT
async def insert_debenture_balcao(conn: AsyncConnection, data:Dict[str, Union[str, List[str], int, List[int]]]) -> dict:
    cols = ["codigo_identificacao", "data_do_negocio", "codigo_do_ativo", "quantidade", "preco_unitario", "volume_financeiro", "taxa"]
    values = [data.get(col) for col in cols]
    is_bulk = any(isinstance(v, list) for v in values)
    async with conn.cursor(row_factory=dict_row) as cur:
        # single insert
        if not is_bulk:
            await cur.execute(insert_query, values)
            await conn.commit()
            return await cur.fetchone()
        
        else:
            # bulk insert
            lengths = [len(v) if isinstance(v, list) else 1 for v in values]
            max_len = max(lengths)
            for i, v in enumerate(values):
                if not isinstance(v, list):
                    values[i] = [v] * max_len
                elif len(v) != max_len:
                    raise ValueError("Tamanhos das listas devem ser iguais")

            records = list(zip(*values))

            await cur.executemany(insert_query[:-12]+";", records) #removing return *; from the query
            await conn.commit()
            return {"inserted": len(records)}
    
# SELECT
async def select_all_debenture_balcao(conn: AsyncConnection) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query)
        return await cur.fetchall()
    
# SELECT DATES
async def select_dates_debenture_balcao(conn: AsyncConnection) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query)
        return await cur.fetchall()
    