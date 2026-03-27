# Checklist de Cumplimiento Legal — SaaS en México
**Marco legal:** LFPDPPP 2026 + CFF (SAT) + LSSI equivalente
**Aplicable a:** Cualquier SaaS que opere en México o procese datos de ciudadanos mexicanos
**Última revisión:** 2026-03-25

---

## FASE 1 — Infraestructura y Datos

### 1.1 Base de Datos
- [ ] Identificar proveedor y región donde están almacenados los datos
- [ ] Si la BD está fuera de México: verificar que el proveedor tenga cláusulas de transferencia internacional adecuadas
- [ ] Habilitar SSL/TLS en la conexión a la base de datos
- [ ] Implementar aislamiento multi-tenant (cada cliente solo ve sus datos)
- [ ] No exponer credenciales de BD en el código fuente (.gitignore para .env)

### 1.2 Hosting
- [ ] Identificar en qué región corren las funciones serverless
- [ ] Verificar que HTTPS esté habilitado en producción
- [ ] Configurar variables de entorno en el proveedor de hosting (no hardcodear)

### 1.3 Almacenamiento de Archivos
- [ ] Si usas S3/R2/Cloudinary: identificar región del bucket
- [ ] Restringir acceso público a archivos sensibles (solo URLs firmadas)

### 1.4 Servicios de IA
- [ ] Si usas OpenAI/OpenRouter/Anthropic: revisar política de retención de datos
- [ ] Verificar que el tier utilizado NO entrene modelos con tus datos de usuario
- [ ] Activar "Zero Data Retention" si el proveedor lo ofrece
- [ ] No enviar datos personales identificables al modelo (usar IDs, no nombres/emails)

---

## FASE 2 — Proveedores de Servicio (DPA)

Para cada proveedor externo que procese datos de tus usuarios, debes tener un DPA firmado.

### 2.1 Email Transaccional
- [ ] Identificar proveedor (Resend, SendGrid, Mailgun, etc.)
- [ ] Descargar o aceptar el DPA desde el panel del proveedor
- [ ] Guardar copia en `docs/legal/[proveedor]-dpa-signed.pdf`
- [ ] Agregar `docs/legal/*.pdf` al `.gitignore`

> **Resend:** El DPA se considera ejecutado automáticamente al crear la cuenta.
> Descarga la copia desde `resend.com → Settings → Legal → DPA`.

### 2.2 Otros proveedores a revisar
- [ ] Proveedor de pagos (Stripe, Conekta, etc.) — suelen tener DPA automático
- [ ] Proveedor de analytics (si aplica)
- [ ] Proveedor de soporte/chat (si aplica)
- [ ] Proveedor de BD (Neon, PlanetScale, Supabase, etc.)

---

## FASE 3 — Documentos Legales (Páginas del SaaS)

### 3.1 Aviso de Privacidad Integral (LFPDPPP Art. 15-16)
- [ ] Identidad y domicilio del responsable del tratamiento
- [ ] Datos personales recabados (identificación, contacto, fiscales, etc.)
- [ ] Finalidades del tratamiento (primarias y secundarias)
- [ ] Transferencias de datos (con quién se comparten y por qué)
- [ ] Medios para ejercer derechos ARCO
- [ ] Fecha de última actualización
- [ ] Ruta accesible: `/aviso-privacidad` o equivalente

### 3.2 Términos y Condiciones de Uso
- [ ] Aceptación de términos (al registrarse o usar el servicio)
- [ ] Licencia de uso (limitada, no exclusiva, no transferible)
- [ ] Limitación de responsabilidad
- [ ] Política de pagos y cancelaciones (si aplica)
- [ ] Ley aplicable y jurisdicción (México, tribunales de [ciudad])

### 3.3 Derechos ARCO (Art. 22-36 LFPDPPP)
- [ ] Explicación de cada derecho: Acceso, Rectificación, Cancelación, Oposición
- [ ] Canal para ejercerlos (email de privacidad dedicado)
- [ ] Plazo de respuesta: **20 días hábiles** (prorrogables 20 días más)
- [ ] Formato o procedimiento para la solicitud

### 3.4 Política de Cookies
- [ ] Listado de todas las cookies utilizadas (nombre, tipo, duración, finalidad)
- [ ] Distinción: cookies esenciales vs. cookies opcionales
- [ ] Base legal del uso (interés legítimo para esenciales)
- [ ] Instrucciones para gestionar cookies por navegador
- [ ] Ruta accesible: `/politica-cookies`

---

## FASE 4 — Seguridad Técnica

### 4.1 Autenticación
- [ ] Contraseñas hasheadas (bcrypt, argon2) — nunca en texto plano
- [ ] O usar autenticación sin contraseña (Magic Link, OAuth)
- [ ] Protección CSRF en formularios
- [ ] Límite de intentos de login (rate limiting)

### 4.2 Validación de Datos
- [ ] Validar todas las entradas del usuario (Zod, Yup, etc.)
- [ ] Sanitizar datos antes de insertarlos en BD
- [ ] Nunca usar `any` en TypeScript para datos de usuario

### 4.3 Row Level Security / Aislamiento
- [ ] Si usas Supabase: RLS habilitado en todas las tablas con datos de usuario
- [ ] Si usas otro ORM: filtrar siempre por `tenantId` o `userId` en cada query

---

## FASE 5 — Auditoría y Retención

### 5.1 Registro de Auditoría
- [ ] Tabla `audit_logs` en BD con: userId, action, entity, entityId, timestamp
- [ ] Registrar automáticamente: CREATE, DELETE, UPDATE en entidades sensibles
- [ ] Panel visible para el administrador del tenant

### 5.2 Retención Mínima de Datos (no borrar antes de)
- [ ] **Evaluaciones / registros de tratamiento:** 1 año (LFPDPPP)
- [ ] **Contratos comerciales:** 5 años (Art. 30 CFF — SAT)
- [ ] **Facturas CFDI XML:** 5 años fiscales (SAT)
- [ ] **Registros contables:** 10 años (Código de Comercio)
- [ ] El sistema debe **bloquear** la eliminación antes del plazo (no solo advertir)

### 5.3 Derecho al Olvido / Cancelación
- [ ] Proceso documentado para atender solicitud de cancelación de datos
- [ ] Plazo: 20 días hábiles desde la solicitud
- [ ] Excepción: datos sujetos a retención obligatoria no pueden eliminarse antes del plazo

---

## FASE 6 — Facturación (si tu SaaS emite o gestiona facturas)

### 6.1 CFDI 4.0 (vigente)
- [ ] Usar PAC (Proveedor Autorizado de Certificación) homologado por SAT
- [ ] Incluir campos obligatorios: RFC emisor/receptor, régimen fiscal, uso CFDI
- [ ] Conservar XMLs mínimo 5 años fiscales
- [ ] Cancelaciones dentro del plazo permitido por SAT

### 6.2 Verifactu (obligatorio enero 2027)
- [ ] Firma electrónica en cada factura
- [ ] Encadenamiento hash (cada factura incluye hash de la anterior)
- [ ] Código QR verificable por el receptor
- [ ] Envío automático o diferido a la AEAT (aplica para España) / SAT (México)
- [ ] **Deadline:** Planificar implementación antes de octubre 2026

---

## FASE 7 — Verificación Final

- [ ] Revisar que no haya secrets en el repositorio git (`git log` + herramienta de escaneo)
- [ ] Probar flujo completo de solicitud ARCO (enviar email y responder en plazo)
- [ ] Probar que el audit log registra correctamente
- [ ] Probar que la guardia de retención bloquea borrado prematuro
- [ ] Confirmar que todos los DPA están firmados y archivados en `docs/legal/`
- [ ] Confirmar que las 4 páginas legales están accesibles públicamente

---

## Resumen de Estado — SaaS Legal Shield (referencia)

| Item | Estado | Notas |
|------|--------|-------|
| Aviso de privacidad | ✅ Implementado | LFPDPPP 2026 |
| Términos y condiciones | ✅ Implementado | |
| Derechos ARCO | ✅ Implementado | 20 días hábiles |
| Política de cookies | ✅ Implementado | `/politica-cookies` |
| Audit log | ✅ Implementado | Tabla `audit_logs` en Neon |
| Retención de datos | ✅ Implementado | Assessment 1 año, Contrato 5 años |
| DPA Resend | ✅ Firmado | `docs/legal/resend-dpa-signed.pdf` |
| BD región | ⚠️ Neon us-east-1 | Aceptable para México. Migrar si hay clientes en España |
| Verifactu | 🔲 No aplica aún | Sin módulo de facturación activo |
