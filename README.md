# Placement Tracker Frontend

React + Vite frontend for the existing Spring Boot Placement Tracker API.

## Run
Requires Node.js 20.19+ (or a compatible current Node release) and the Spring Boot backend on port 8080.

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Production build
```bash
npm run build
npm run preview
```

## API assumptions
- `POST /api/auth/register`: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login`: `{ "email": "...", "password": "..." }` returns `{ "accessToken": "...", "name": "...", "email": "...", "tokenType": "Bearer" }`
- `GET /api/applications`: array of applications (or a paginated object with `content`)
- `POST /api/applications`, `PUT /api/applications/{id}`, `DELETE /api/applications/{id}`

Protected requests send `Authorization: Bearer <accessToken>`. For browser requests, configure Spring Security CORS to allow `http://localhost:5173`. Do not disable security for protected routes.
