# SalaFinder

Aplicación web para buscar y **reservar salas, laboratorios y auditorios**. Incluye flujos del **parcial**: fake API async (carga / éxito / error), filtros, toasts, roles (usuario / admin), auditoría solo para admin y reservas persistidas en `localStorage`.

## Tecnologías

- **React 19** + **TypeScript**
- **Vite 7**
- **React Router 7**
- **Tailwind CSS 4**
- **Vitest** + Testing Library

## Checklist Parcial (resumen)

| Requisito | Dónde |
|-----------|--------|
| Listado con carga / error / reintentar | `HomePage`, `CreateReservation`, `DetalleSala`, `AuditPage` |
| Simular fallo API espacios | Botón demo en home → `sessionStorage` + `FakeApi` |
| Filtros (nombre, tipo, solo disponibles) | `HomePage` |
| Reservas: conflicto fecha/hora | Home, detalle, `/reservar` |
| Mantenimiento: no reservable | Home, detalle, nueva reserva |
| Login / registro fake + loading + errores | `Login`, `SignUp` → `fakeApi` |
| Rol admin: auditoría, aprobar/rechazar | `/audit`, `MyReservations` |
| Toasts | `AppContext` + `Toast` |
| Persistencia reservas | `localStorage` (`salaFinder.reservas`) |

## Cuentas de prueba (login fake)

- **Admin:** `admin@test.com` (cualquier contraseña) → menú **Auditoría**
- **Usuario:** `demo@test.com` o cualquier email de la lista mock en `fakeapi/data.ts`

Registro (`/signup`) crea sesión local sin backend.

## Scripts

```bash
npm install
npm run dev          # desarrollo
npm run build        # producción
npm run test:run     # tests
npm run lint
```

## Estructura principal

```
src/
├── context/AppContext.tsx   # reservas, usuario, toasts
├── fakeapi/FakeApi.ts       # API simulada (delay, errores demo)
├── pages/                   # Home, detalle, reservas, login, audit…
├── componentes/             # Navbar, Toast, Button…
└── Data/AuditLog.tsx        # tabla de historial
```

La entrega sigue una estructura tipo [concerthub](https://github.com/Silvia-Suarez/concerthub) (Vite + React + rutas), adaptada al dominio **espacios y reservas**.
