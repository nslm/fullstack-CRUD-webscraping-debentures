import httpx
import pandas as pd
from io import StringIO
from datetime import datetime


async def scraper_balcao(start_date:  str, final_date: str):
    payload = {
        "Name": "Trade",
        "Date": start_date,
        "FinalDate": final_date,
        "ClientId": "",
        "Filters": {}
        }
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                "https://arquivos.b3.com.br/bdi/table/export/csv?sort=TckrSymb&lang=pt-BR",  
                json=payload,
                headers={
                    'Content-Type': 'application/json',
                    'Cookie': '__cf_bm=3.1MboTwB3kUcLyrl2VBGo1ZDy1g67gJyJmEUGSIRJc-1754879983-1.0.1.1-i8BCIGODV4JY_mweXVUj_.R5hHtYRQHT3wA6zNRhAP9neOW4BhHGHP09McgMfYEgl0hg5i1EpeODgUcO1xqvFiYVlrrBKwTmv9KAmLExHug'
                 }
            )
            resp.raise_for_status()
            resp.encoding = 'utf-8'
            return {"status": "ok", "resp": resp.text}
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    