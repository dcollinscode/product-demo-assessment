**Stack:** React 18 + TypeScript · Node/Express + TypeScript · PostgreSQL

---

## Features

- List and create products via a clean REST API
- Input validation (Zod on the backend, form validation on the frontend)
- Structured request logging (Winston)
- Global error handling with operational vs programmer error separation
- Security: Helmet, CORS whitelist, rate limiting, parameterised SQL queries
- Accessible UI with ARIA attributes, keyboard navigation, and reduced-motion support
- Unit tests (service layer with mocked DB) + integration tests (Supertest + real DB)
- Component tests (React Testing Library)

---

## Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14 
- Git
---

## Getting started

### 1. Clone the repo

```bash
git clone git@github.com:dcollinscode/product-demo-assessment.git
cd product-demo-assessment
```

### 2. Backend

```bash
cd Backend
cp .env.example .env          # set DATABASE_URL
npm install
npx prisma migrate deploy     # runs versioned migrations
npm run dev                   # http://localhost:3001
```

### 3. Frontend

From the repository root (`cd ..` if you are still inside `Backend`):

```bash
cd Frontend
cp .env.example .env          # set VITE_API_URL=http://localhost:3001
npm install
npm run dev                   # http://localhost:5173
```
 
---

## Environment variables
 
**`Backend/.env.example`**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgres://user:password@localhost:5432/products_db
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```
 
**`Frontend/.env.example`**
```
VITE_API_URL=http://localhost:3001
```

---
 
## API reference
 
| Method | Endpoint        | Body               | Status | Response              |
|--------|-----------------|--------------------|--------|-----------------------|
| GET    | /api/products   | —                  | 200    | `{ data: Product[] }` |
| POST   | /api/products   | `{ name: string }` | 201    | `{ data: Product }`   |
| POST   | /api/products   | invalid body       | 400    | `{ error, details }`  |
| GET    | /health         | —                  | 200    | `{ status: "ok" }`    |


## What I'd add next
 
- `DELETE /api/products/:id` and `PATCH /api/products/:id` endpoints
- Pagination on `GET /api/products` (`?page=1&limit=20`)
- Docker Compose to spin up the full stack with one command
- CI pipeline (GitHub Actions) running tests on every push
- Environment-specific logging levels via `LOG_LEVEL`
