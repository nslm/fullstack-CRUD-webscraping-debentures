import httpx
import asyncio
import pandas as pd
from io import StringIO
from datetime import datetime


async def scraper_balcao():
    payload = {
        "Name": "Trade",
        "Date": "2025-08-07",
        "FinalDate": "2025-08-07",
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
            excel_io = StringIO(resp.text)

            df = pd.read_csv(excel_io, sep=";", header=7, encoding='utf-8')
            df.columns = df.columns.str.strip()
            df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

            df = df[df["Instrumento Financeiro"]=="DEB"]
            df = df[["Cód. Identificador do Negócio", "Data Negócio", "Código IF", "Quantidade Negociada", "Preço Negócio", "Volume Financeiro (R$)", "Taxa Negócio"]]

            df.rename(columns={"Cód. Identificador do Negócio": "codigo_identificacao", "Data Negócio": "data_do_negocio", 
                               "Código IF": "codigo_do_ativo", "Quantidade Negociada": "quantidade",
                               "Preço Negócio": "preco_unitario", "Volume Financeiro (R$)": "volume_financeiro",
                               "Taxa Negócio": "taxa" }, inplace=True)
            
            df["data_do_negocio"] = df["data_do_negocio"].apply(lambda x:datetime.strptime(str(x), "%d/%m/%Y").strftime("%Y-%m-%d"))
            df["preco_unitario"] = df["preco_unitario"].apply(lambda x:int(float(str(x).replace(',','.'))*10**6))
            df["volume_financeiro"] = df["volume_financeiro"].apply(lambda x:int(float(str(x).replace(',','.'))*10**2))
            df["taxa"] = df["taxa"].apply(lambda x:int(float(str(x).replace(',','.'))*10**4) if str(x).lower() not in ('nan', '-') else None)
            df['taxa'] = df['taxa'].astype('Int64')
            print(df)
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    
asyncio.run(scraper_balcao())