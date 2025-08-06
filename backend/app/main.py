from fastapi import FastAPI
from routes import analytics_caracteristicas, analytics_evolucao, coleta_balcao, coleta_caracteristicas, debentures


app = FastAPI()

app.include_router(analytics_caracteristicas, prefix="/api/analytics/caracteristicas", tags=["Analytics"])
app.include_router(analytics_evolucao, prefix="/api/analytics/evolucao", tags=["Analytics"])
app.include_router(coleta_balcao, prefix="/api/coleta/balcao", tags=["Coleta"])
app.include_router(coleta_caracteristicas, prefix="/api/coleta/caracteristicas", tags=["Coleta"])
app.include_router(debentures, prefix="/api/debentures", tags=["Debentures"])
