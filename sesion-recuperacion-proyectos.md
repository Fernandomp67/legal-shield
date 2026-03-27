# Sesión de Recuperación y Limpieza — 2026-03-27

## Contexto
Malware detectado en múltiples proyectos (inyectado por Cursor Agent). Se limpió todo el disco D:\, se resetearon credenciales y se reconectaron los proyectos.

---

## 1. Malware eliminado

| Proyecto | Archivo | Tipo |
|----------|---------|------|
| `SaaS-legal` | `preinstall.js` | Esteganografía Unicode + eval() |
| `clini-vet` | `preinstall.js` | Esteganografía Unicode + eval() |
| `saas-factory-v4/page-oficial` | `preinstall.cjs` | Esteganografía Unicode + eval() |
| `mapa tuxtla/mapa-electoral` | `preinstall.js` | Esteganografía Unicode + eval() |

Commit original del malware: `2c5e86d` — Co-authored-by: Cursor

---

## 2. Credenciales comprometidas — acciones tomadas

- Neon: BDs eliminadas o passwords reseteados en todos los proyectos
- Resend: API key revocada y regenerada
- Vercel + GitHub: proyectos eliminados y recreados
- ~60 archivos con credenciales hardcodeadas eliminados del disco

---

## 3. SaaS-legal — Estado actual

- **GitHub:** https://github.com/makeflowia-lab/legal-shield (eliminado y recreado)
- **Vercel:** https://legal-shield-saas.vercel.app ✅
- **BD Neon:** Nueva BD creada, schema aplicado con `drizzle-kit push`
- **Acceso público:** Activado temporalmente (middleware deshabilitado para evaluadores)
- **Para reactivar magic link:** Ver `activar-link-magico.md`

### Variables en Vercel (SaaS-legal):
| Variable | Estado |
|----------|--------|
| `DATABASE_URL` | ✅ Nueva BD Neon |
| `AUTH_SECRET` | ✅ Configurado |
| `AUTH_RESEND_KEY` | ✅ Nueva key de Resend |
| `NEXT_PUBLIC_APP_URL` | ✅ https://legal-shield-saas.vercel.app |

---

## 4. clini-vet — Estado actual

- **GitHub:** https://github.com/makeflowia-lab/clini-vet ✅
- **Vercel:** https://clini-vet-rho.vercel.app ✅
- **BD Neon:** Password reseteado, `.env.local` actualizado
- **Vercel env vars:** ⚠️ Pendiente agregar variables (DATABASE_URL mínimo)

---

## 5. clinica-odon — Estado actual

- **GitHub:** https://github.com/makeflowia-lab/clinica-odon ✅
- **Vercel:** https://clinica-odon.vercel.app ✅
- **BD Neon:** Password reseteado, `.env` actualizado
- **Fixes aplicados:** `onCancel` prop, `maxDuration` config, `@types/qrcode`, `backups` excluido de tsconfig
- **Vercel env vars:** ⚠️ Pendiente agregar variables (DATABASE_URL mínimo)

---

## 6. taxi-express — Estado actual

- **GitHub:** https://github.com/makeflowia-lab/taxi-express ✅
- **Vercel:** ⏳ Pendiente deploy
- **BD Neon:** Password reseteado, `.env` actualizado
- **Bloqueador:** Necesita `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Fixes aplicados:** `Calendar` + `LogOut` imports, archivos debug eliminados

### Variables que necesita taxi-express en Vercel:
| Variable | Fuente |
|----------|--------|
| `DATABASE_URL` | Neon — ya en `.env` local |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API Keys → Publishable key |
| `NEXTAUTH_SECRET` o `AUTH_SECRET` | Generar con: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | https://taxi-express.vercel.app (URL final en Vercel) |

---

## 7. Proyectos pendientes de verificar env vars en Vercel

Estos proyectos se desplegaron pero sus variables de entorno en Vercel pueden estar vacías:

| Proyecto | URL Vercel | Acción pendiente |
|----------|------------|-----------------|
| `clini-vet` | https://clini-vet-rho.vercel.app | Agregar DATABASE_URL + vars de auth |
| `clinica-odon` | https://clinica-odon.vercel.app | Agregar DATABASE_URL + vars de auth |
| `taxi-express` | Pendiente deploy | Agregar Stripe keys + DATABASE_URL |

---

## 8. Documentos generados esta sesión

| Archivo | Propósito |
|---------|-----------|
| `activar-link-magico.md` | Instrucciones para reactivar magic link en SaaS-legal |
| `INSTRUCCIONES-COPIA.md` | Guía para compartir el proyecto con compañeros |
| `reporte-malware-cursor.md` | Evidencia del malware para reportar a Cursor/npm |
| `sesion-recuperacion-proyectos.md` | Este archivo |
