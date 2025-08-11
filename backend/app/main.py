from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analytics_caracteristicas, analytics_evolucao, coleta_balcao, coleta_caracteristicas, debentures
from app.config import load_config, get_redis


def create_app(env: str = "dev") -> FastAPI:
    r = get_redis(env)
    config = load_config(env)
    origins = config["FRONTEND_ORIGIN"]
    
    app = FastAPI()
    app.state.r = r 
    app.state.env = env 
    app.state.config = config 

    app.include_router(analytics_caracteristicas, prefix="/api/analytics/caracteristicas", tags=["Analytics"])
    app.include_router(analytics_evolucao, prefix="/api/analytics/evolucao", tags=["Analytics"])
    app.include_router(coleta_balcao, prefix="/api/coleta/balcao", tags=["Coleta"])
    app.include_router(coleta_caracteristicas, prefix="/api/coleta/caracteristicas", tags=["Coleta"])
    app.include_router(debentures, prefix="/api/debentures", tags=["Debentures"])

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app

