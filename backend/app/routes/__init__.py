from app.routes.analytics.caracteristicas import router as analytics_caracteristicas
from app.routes.analytics.evolucao import router as analytics_evolucao
from app.routes.coleta.balcao import router as coleta_balcao
from app.routes.coleta.caracteristicas import router as coleta_caracteristicas
from app.routes.debentures.debentures import router as debentures


__all__ = ["analytics_caracteristicas", "analytics_evolucao", "coleta_balcao", "coleta_caracteristicas", "debentures"]