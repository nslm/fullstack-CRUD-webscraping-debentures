from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


async def transformation_not_workday_list(resp):
    try:
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
    