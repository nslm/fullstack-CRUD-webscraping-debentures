from app.routes.analytics.debentures_caracteristicas import router as analytics_caracteristicas
from app.routes.analytics.debentures_evolucao import router as analytics_evolucao
from app.routes.analytics.debentures_balcao import router as analytics_balcao
from app.routes.coleta.debentures_balcao import router as coleta_balcao
from app.routes.coleta.debentures_caracteristicas import router as coleta_caracteristicas
from app.routes.debentures.debentures import router as debentures


__all__ = ["analytics_balcao", "analytics_caracteristicas", "analytics_evolucao", "coleta_balcao", "coleta_caracteristicas", "debentures"]