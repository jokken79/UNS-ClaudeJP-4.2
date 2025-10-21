# Frontend Next.js 15 - UNS-ClaudeJP 4.2

## 🚀 Scripts principales

```bash
npm install          # Instala dependencias
npm run dev          # Desarrollo (http://localhost:3000)
npm run lint         # Linter
npm run build        # Build producción
npm run start        # Servir build en producción
```

En Docker estos comandos se ejecutan automáticamente al levantar `docker compose up -d`.

## 🔑 Variables de entorno

- `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8000`)
- `NEXT_PUBLIC_APP_NAME` (muestra "UNS-ClaudeJP 4.2")
- `NEXT_PUBLIC_APP_VERSION`

Configura valores adicionales en `.env.local` si desarrollas fuera de Docker.

## 🧩 Estructura relevante

```
frontend-nextjs/
├── app/              # Rutas App Router
├── components/       # Componentes reutilizables
├── lib/              # Utilidades y clientes
└── public/           # Recursos estáticos (logos)
```

La página de login (`app/login/page.tsx`) contiene el diseño enterprise descrito en [LOGIN_PAGE_UPGRADE.md](../LOGIN_PAGE_UPGRADE.md).

## 🧪 Pruebas y QA

Se recomienda configurar `npm run test` o Playwright para validaciones UI. Por ahora la verificación se realiza mediante `npm run lint` y pruebas manuales. Documenta nuevos comandos en este archivo.

## 🔄 Integración con backend

El frontend consume la API FastAPI protegida por JWT. Asegúrate de que `NEXT_PUBLIC_API_URL` coincida con la URL del backend y que CORS esté configurado en `FRONTEND_URL`.

---

**Última actualización:** 2025-02-10
