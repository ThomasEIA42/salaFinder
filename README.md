# SalaFinder (frontend)

Plataforma web para buscar espacios y gestionar reservas, conectada al backend **BackendSalaFinder** (ASP.NET Core).

## Desarrollo local

```bash
npm install
npm run dev
```

Asegúrate de tener el API en `https://localhost:7060` (ver [INTEGRACION.md](../INTEGRACION.md) en la raíz del workspace).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (proxy `/api` → backend) |
| `npm run build` | Build de producción |
| `npm run test` | Tests con Vitest |

## Stack

React 19, TypeScript, Vite, Tailwind CSS, React Router.

La capa HTTP está en `src/api/api.ts` (JWT en `localStorage`).
