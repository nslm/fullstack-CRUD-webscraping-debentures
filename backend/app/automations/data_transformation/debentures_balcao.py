import httpx
import pandas as pd
from io import StringIO
from datetime import datetime


async def transformation_balcao(resp):
    try:
        excel_io = StringIO(resp)

        df = pd.read_csv(excel_io, sep=";", header=7, encoding='utf-8', low_memory=False)
        df.columns = df.columns.str.strip()
        df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

        df = df[df["Instrumento Financeiro"]=="DEB"]
        df = df[["Cód. Identificador do Negócio", "Data Negócio", "Código IF", "Quantidade Negociada", "Preço Negócio", "Volume Financeiro (R$)", "Taxa Negócio"]]

        df.rename(columns={"Cód. Identificador do Negócio": "codigo_identificacao", "Data Negócio": "data_do_negocio", 
                            "Código IF": "codigo_do_ativo", "Quantidade Negociada": "quantidade",
                            "Preço Negócio": "preco_unitario", "Volume Financeiro (R$)": "volume_financeiro",
                            "Taxa Negócio": "taxa" }, inplace=True)
        
        df["data_do_negocio"] = df["data_do_negocio"].apply(lambda x:datetime.strptime(str(x), "%d/%m/%Y").strftime("%Y-%m-%d"))
        df["preco_unitario"] = df["preco_unitario"].apply(lambda x:int(float(str(x).replace(',','.'))*10**6) if str(x).lower() not in ('nan', 'na', 'none', '-', '') else None)
        df["volume_financeiro"] = df["volume_financeiro"].apply(lambda x:int(float(str(x).replace(',','.'))*10**2) if str(x).lower() not in ('nan', 'na', 'none', '-', '') else None)
        df["taxa"] = df["taxa"].apply(lambda x:int(float(str(x).replace(',','.'))*10**4) if str(x).lower() not in ('nan', 'na', 'none', '-', '') else None)
        df['taxa'] = df['taxa'].astype('Int64')
        df['preco_unitario'] = df['preco_unitario'].astype('Int64')
        df['volume_financeiro'] = df['volume_financeiro'].astype('Int64')

        data = df.to_dict(orient='list')
        return {"status": "ok", "data": data}
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    