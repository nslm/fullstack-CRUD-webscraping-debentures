# Fullstack Debêntures (Webscraping+CRUD)

Automação para coletar, transformar e analisar dados públicos do mercado secundario de debêntures.


Stack principal: 
Frontend React + Vite (MUI) 
Backend FastAPI, Postgres e Redis. 
Orquestração via Docker.

---

## Sumário rápido

- ✅ Rodar local (dev): `docker compose -f docker-compose.fullstack.yml up --build`
- ✅ Backend: [http://localhost:8000](http://localhost:8000) (API)
- ✅ Frontend dev: [http://localhost:5173](http://localhost:5173) — se usar docker compose já configurado para expor 5173
- ✅ Testes de integração backend: `pytest` (há testes em `backend/tests`)

---

## Pré-requisitos

- Docker & Docker Compose instalados (Docker Desktop ou Docker Engine)
- (Opcional) Node.js + npm/yarn — apenas se quiser rodar/compilar frontend localmente sem Docker
- (Opcional) Python 3.10+ — apenas para rodar backend local sem Docker

Arquivo de configuração de ambiente: `.env.dev` (já incluído no projeto). 

---

## Estrutura básica do repositório

```
/
├─ backend/                 # FastAPI + scripts de automação, tests, Dockerfile
├─ frontend/                # React + Vite app (TSX), Dockerfile (build) + Vite Build
├─ docker-compose.fullstack.yml
├─ docker-compose.backend.yml
├─ .env.dev
└─ README.md
```

### Principais pastas

- `backend/app` — código FastAPI (routes, automations, DB access)
- `frontend/src` — app React/Vite
- `frontend/Dockerfile` — Dockerfile multi-stage (build com Node/Yarn)
- `backend/Dockerfile` — imagem Python + uvicorn

---

## Rodando em desenvolvimento (Docker)


1. Abrir terminal na raiz do repositório.
2. Subir todos os serviços (backend, frontend, postgres, redis):

```bash
docker compose -f docker-compose.fullstack.yml up --build
```

Acesse:
- Frontend (Vite dev server): [http://localhost:5173](http://localhost:5173)
- Backend (FastAPI): [http://localhost:8000](http://localhost:8000) 
— Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

Observações:
- O `docker-compose.fullstack.yml` já mapeia portas e define `HOST=0.0.0.0` para o frontend dev server.
- Se o frontend dev não estiver acessível, verifique se o script dev do frontend roda com `--host`.

---

## Rodando backend isolado (Docker)

```bash
docker compose -f docker-compose.backend.yml up --build
```

## Rodando frontend isolado (npm)
Para rodar em modo de desenvolvimento (instala dependências e inicia o servidor):
```bash
npm install
npm run dev
```
Para apenas visualizar a build já gerada (economiza tempo de instalação e build):
```bash
npm run preview
```

## Endpoints principais (visão rápida)

Enquanto rodando o backend localmente: Documentação em [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Coleta / automações
```
POST   /api/coleta/caracteristicas/start/
GET    /api/coleta/caracteristicas/status/{run_id}/
GET    /api/coleta/caracteristicas/logs/
POST   /api/coleta/balcao/start/
GET    /api/coleta/balcao/status/{run_id}/
GET    /api/coleta/balcao/logs/
GET    /api/coleta/balcao/dates/
GET    /api/coleta/balcao/lastworkday/
GET    /api/coleta/balcao/notworkdaylist/
```

Observações: 
- `/api/coleta/XXX/status/{run_id}/` Serve para retornar o status da automação de coleta que está rodando, por isso um uuid é requerido no payload do endpoint /start/.
- `/api/coleta/XXX/logs/` Logs de execução de cada automação de coleta.
- `/api/coleta/balcao/dates/` Retorna as datas já capturdas pela automação de negociações de balcão do mercado secundario.
- `/api/coleta/balcao/lastworkday/` Obtem o ultimo dia util do endpoint da B3.
- `/api/coleta/balcao/notworkdaylist/` Obtem uma lista de dias não-uteis dos meses.


Exemplos payload:

`/api/coleta/balcao/start/`:
```json
{
  "run_id": "2025-08-15-01",
  "Start_Date": "2024-01-01",
  "Final_Date": "2024-12-31"
}
```

`/api/coleta/caracteristicas/start/`:
```json
{
  "run_id": "2025-08-15-01",
}
```

### Analytics
```
GET /api/analytics/caracteristicas/
GET /api/analytics/evolucao/
GET /api/analytics/balcao/
```

### CRUD debêntures
```
GET    /api/debentures/
POST   /api/debentures/
PUT    /api/debentures/{codigo}/
DELETE /api/debentures/{codigo}/
```


## Banco de dados e cache

- Postgres: definido no docker-compose com volume `pgdata`.
- Script de inicialização: `backend/init.sql`
- Redis: usado para cache manual e controle de status das automações (app.state.r no FastAPI)
- Variáveis de conexão em `.env.dev`

---

## Tecnologias / dependências principais

- Backend: Python 3.10, FastAPI, uvicorn, httpx, psycopg[binary], redis.asyncio, python-dotenv, pandas, numpy
- Frontend: React + Vite, TypeScript, Material UI, ChartJS, axios
- Infra: Docker, Docker Compose, Postgres, Redis

---

