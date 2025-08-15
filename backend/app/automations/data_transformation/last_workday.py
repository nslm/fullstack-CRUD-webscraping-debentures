async def transformation_last_workday(resp):
    try:
        resp.raise_for_status()
        date = resp.text.split("T")[0].replace('"',"")
        return {"status": "ok", "last_workday": date}
    
    except Exception as e:
        print(e)
        return {"status": "erro", "detalhe": str(e)}
    