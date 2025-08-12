import httpx
import pandas as pd
from io import StringIO
from datetime import datetime


async def scraper_caracteristicas():
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get(
                "https://www.debentures.com.br/exploreosnd/consultaadados/emissoesdedebentures/caracteristicas_e.asp?tip_deb=publicas&op_exc=Nada",  
                headers={"Accept": "application/vnd.ms-excel"}
            )
            resp.raise_for_status()
            resp.encoding = 'cp1252'
            excel_io = StringIO(resp.text)

            df = pd.read_csv(excel_io, sep="\t", header=2, encoding='cp1252', low_memory=False)

            df.columns = df.columns.str.strip()
            df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
            # usado para validar se a taxa está com no maximo 4 casas decimais, ja que usarei inteiro na coluna sa base e dividirei por 10000
            #print(df['Juros Criterio Novo - Taxa'].apply(lambda x:len(str(x).split(',')[1]) if len(str(x).split(','))>1 else 0 ).max())

            df["Juros Criterio Novo - Taxa"] = df["Juros Criterio Novo - Taxa"].apply(lambda x:float(str(x).replace(',','.').replace('%','').strip())*10000)
            df["Juros Criterio Novo - Taxa"] = df["Juros Criterio Novo - Taxa"].apply(lambda x: int(x) if str(x).lower() != 'nan' else None)
            df["Data de Vencimento"] = df["Data de Vencimento"].apply(lambda x:datetime.strptime(str(x), "%d/%m/%Y").strftime("%Y-%m-%d") if str(x).lower() != 'nan' else None)
            df = df[["Codigo do Ativo", "Situacao", "Empresa", "Data de Vencimento", "indice", "Juros Criterio Novo - Taxa"]]
            df.rename(columns={"Codigo do Ativo":"codigo", "Situacao":"situacao", "Empresa":"emissor", "Data de Vencimento":"vencimento", "Juros Criterio Novo - Taxa":"taxa"}, inplace=True)
            df['taxa'] = df['taxa'].astype('Int64')

            data = df.to_dict(orient='list')

            return {"status": "ok", "data": data}

    except Exception as e:
        return {"status": "erro", "detalhe": str(e)}

