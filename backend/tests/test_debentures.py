import pytest

@pytest.mark.asyncio
async def test_create_debenture(client):
    response1 = client.delete("/api/debentures/?codigo=DB123")
    response = client.post("/api/debentures/", json={
        "codigo": "DB123",
        "emissor": "Empresa XYZ",
        "vencimento": "2030-01-01",
        "indice": "IPCA",
        "taxa": 12
    })
    assert "debenture" in str(response.json())
    assert response.status_code == 200
    #assert "Debenture removida com sucesso" in str(response1.json())
    #assert response1.status_code == 200


@pytest.mark.asyncio
async def test_get_debentures(client):
    response = client.get("/api/debentures/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_update_debenture(client):
    response1 = client.delete("/api/debentures/?codigo=DB124")
    response2 = client.post("/api/debentures/", json={
        "codigo": "DB124",
        "emissor": "Empresa XYZ",
        "vencimento": "2030-01-01",
        "indice": "IPCA",
        "taxa": 12
    })
    response = client.put("/api/debentures/?codigo=DB124", json={
        "emissor": "Empresa XYZ Atualizada",
        "vencimento": "2031-01-01",
        "indice": "CDI",
        "taxa": 13
    })
    assert "debenture" in str(response.json())
    assert response.status_code == 200
    #assert "Debenture removida com sucesso" in str(response1.json())
    #assert response1.status_code == 200
    #assert response2.status_code == 200
    #assert "debenture" in response2.json()


@pytest.mark.asyncio
async def test_delete_debenture(client):
    response1 = client.post("/api/debentures/", json={
        "codigo": "DB125",
        "emissor": "Empresa XYZ",
        "vencimento": "2030-01-01",
        "indice": "IPCA",
        "taxa": 12
    })
    response = client.delete("/api/debentures/?codigo=DB125")
    assert "Debenture removida com sucesso" in str(response.json())
    assert response.status_code == 200
    #assert response1.status_code == 200
    #assert "debenture" in response1.json()
