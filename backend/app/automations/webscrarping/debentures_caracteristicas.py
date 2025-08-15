import httpx


async def scraper_caracteristicas():
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.get(
                "https://www.debentures.com.br/exploreosnd/consultaadados/emissoesdedebentures/caracteristicas_e.asp?tip_deb=publicas&op_exc=Nada",  
                headers={"Accept": "application/vnd.ms-excel"}
            )
            resp.raise_for_status()
            resp.encoding = 'cp1252'
            return {"status": "ok", "resp": resp.text}

    except Exception as e:
        return {"status": "erro", "detalhe": str(e)}
