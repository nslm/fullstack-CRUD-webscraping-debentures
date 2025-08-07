import pytest
#from httpx import AsyncClient
from fastapi.testclient import TestClient
from app.main import create_app

@pytest.fixture(scope="session")
def client():
    app = create_app(env="test")
    #with AsyncClient(app=app, base_url="http://test") as c:
    with TestClient(app) as c:
        yield c
