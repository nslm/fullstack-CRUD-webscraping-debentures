from psycopg import AsyncConnection
from fastapi import Request

async def get_db_connection(request: Request) -> AsyncConnection:
    config = request.app.state.config
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
        