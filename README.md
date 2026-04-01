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

### 3. Backend
 
```bash
cd Backend
cp .env.example .env          # set DATABASE_URL
npm install
npx prisma migrate deploy     # runs versioned migrations
npm run dev                   # http://localhost:3001
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