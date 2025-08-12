import httpx
from datetime import datetime


async def scraper_last_workday():
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get(
                "https://arquivos.b3.com.br/bdi/table/workday?",  
                headers={
                    'Content-Type': 'application/json',
                    'Cookie': '__cf_bm=3.1MboTwB3kUcLyrl2VBGo1ZDy1g67gJyJmEUGSIRJc-1754879983-1.0.1.1-i8BCIGODV4JY_mweXVUj_.R5hHtYRQHT3wA6zNRhAP9neOW4BhHGHP09McgMfYEgl0hg5i1EpeODgUcO1xqvFiYVlrrBKwTmv9KAmLExHug'
                 }
            )
            resp.raise_for_status()
            date = resp.text.split("T")[0].replace('"',"")
            return {"status": "ok", "last_workday": date}
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    