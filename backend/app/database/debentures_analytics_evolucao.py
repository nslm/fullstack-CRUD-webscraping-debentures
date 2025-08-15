from psycopg import AsyncConnection
from collections import defaultdict
from psycopg.rows import dict_row
from typing import List


with open("app/querys/analitycs_debentures_evolucao.sql") as f:
    queries = f.read().split("-- ")

select_query = [q for q in queries if q.startswith("SELECT")][0][6:].strip()

    
# SELECT
async def select_debentures_evolucao(
    conn: AsyncConnection,
    codigos: List[str],
    data_inicio: str,
    data_fim: str
    ) -> list[dict]:
    async with conn.cursor(row_factory=dict_row) as cur:
        await cur.execute(select_query, (codigos, data_inicio, data_fim))        
        result = await cur.fetchall()

        volume_dict = defaultdict(dict)
        taxa_dict = defaultdict(dict)
        
        for row in result:
            date = row["data_do_negocio"].strftime("%Y-%m-%d")
            codigo = row["codigo_do_ativo"]
            volume = row["volume_medio_diario"]
            taxa = row["taxa_media_ponderada"]
            
            volume_dict[date][codigo] = volume
            taxa_dict[date][codigo] = taxa

        volume_list = [{"data_do_negocio": date, **vol} for date, vol in volume_dict.items()]
        taxa_list = [{"data_do_negocio": date, **tax} for date, tax in taxa_dict.items()]
        
        return {
            "volume": volume_list,
            "taxa": taxa_list
        }

