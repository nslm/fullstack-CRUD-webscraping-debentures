# Vite + React + MUI Debentures Template (Updated)

Template criado para demonstrar uma aplicação Vite + React (TypeScript) usando Material UI (MUI).
Esta versão mantém toda a estrutura anterior e adiciona:
- Integração com backend via `.env.dev` na raiz (considere que `.env.dev` contém `VITE_API_BASE=http://localhost:8000`)
- Operações CRUD (GET/POST/PUT/DELETE) para `/api/debentures`
- Paginação e filtro na tabela de Debentures (cliente-side)

### Como rodar
Coloque seu arquivo `.env.dev` na raiz do repositório (ex.: `../.env.dev` relativo à pasta `frontend`):
```
VITE_API_BASE=http://localhost:8000
```

Depois rode:
```bash
npm install
npm run dev
```

O dev server corre em `http://localhost:5173` por padrão.
