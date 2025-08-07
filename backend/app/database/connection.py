from psycopg import AsyncConnection
from app.config import load_config

async def get_db_connection(env: str = "dev") -> AsyncConnection:
    config = load_config(env)
    conn: AsyncConnection = await AsyncConnection.connect(
        host=config["POSTGRES_HOST"],
        port=int(config["POSTGRES_PORT"]),
        dbname=config["POSTGRES_DB"],
        user=config["POSTGRES_USER"],
        password=config["POSTGRES_PASSWORD"],
    )
    try:
        yield conn
    finally:
        await conn.close()