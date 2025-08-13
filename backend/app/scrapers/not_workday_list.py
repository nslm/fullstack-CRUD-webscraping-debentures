import httpx
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


async def scraper_not_workday_list():
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            last_year = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
            resp = await client.get(
                f"https://arquivos.b3.com.br/bdi/table/workdays?date={last_year}&hasHistory=true",  
                headers={
                    'Content-Type': 'application/json',
                    'Cookie': '__cf_bm=3.1MboTwB3kUcLyrl2VBGo1ZDy1g67gJyJmEUGSIRJc-1754879983-1.0.1.1-i8BCIGODV4JY_mweXVUj_.R5hHtYRQHT3wA6zNRhAP9neOW4BhHGHP09McgMfYEgl0hg5i1EpeODgUcO1xqvFiYVlrrBKwTmv9KAmLExHug'
                 }
            )
            resp.raise_for_status()
            str_ls_dates = resp.text[1:-1].split(",")
            ls_dates = [c.split("T")[0][1:] for c in str_ls_dates]
            hoje = datetime.today()
            inicio = (hoje - relativedelta(months=12)).replace(day=1)
            delta = (hoje - inicio).days + 1  
            all_datas = [(inicio + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(delta)]
            final_list = list(set(all_datas)-set(ls_dates))
            final_list.sort(reverse=True)

            return {"status": "ok", "not_workday_list": final_list}
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    