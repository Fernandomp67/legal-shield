# Checklist de Cumplimiento Legal — SaaS en Europa (RGPD)
**Marco legal:** RGPD (Reglamento UE 2016/679) + LSSI (España) + ePrivacy
**Aplicable a:** Cualquier SaaS que ofrezca servicios a ciudadanos de la UE, aunque el proveedor esté fuera de Europa
**Principio de extraterritorialidad:** Si un mexicano vende a europeos, el RGPD le aplica (Art. 3.2 RGPD)
**Última revisión:** 2026-03-25

---

## DIFERENCIAS CLAVE vs. México

| Aspecto | México (LFPDPPP) | Europa (RGPD) |
|---------|-----------------|---------------|
| Plazo respuesta ARCO | 20 días hábiles | 30 días naturales |
| Multa máxima | Hasta $63M MXN | 4% facturación anual o €20M |
| DPO obligatorio | No | Solo si procesas datos sensibles a gran escala |
| Notificación de brecha | No especificado | 72 horas a la autoridad + afectados |
| Base legal requerida | Consentimiento o relación contractual | 6 bases legales posibles (Art. 6) |
| Transferencia internacional | Con garantías contractuales | Requiere mecanismo específico (SCCs, BCRs) |

---

## FASE 1 — Infraestructura y Datos

### 1.1 Base de Datos — CRÍTICO
- [ ] La BD debe estar en región **europea** (Frankfurt `eu-central-1`, Irlanda `eu-west-1`)
- [ ] **Neon:** crear nuevo proyecto en región EU, migrar datos, actualizar `DATABASE_URL`
- [ ] **Supabase:** seleccionar Frankfurt al crear el proyecto
- [ ] **PlanetScale/Railway:** verificar opciones de región EU disponibles
- [ ] Cifrado en reposo habilitado (AES-256 o equivalente)
- [ ] Copias de seguridad también en región EU

### 1.2 Hosting / Funciones Serverless
- [ ] **Vercel:** configurar `"regions": ["fra1"]` en `vercel.json` (Frankfurt)
- [ ] O usar `"regions": ["dub1"]` (Dublín)
- [ ] Verificar que las Edge Functions también corran en EU
- [ ] HTTPS obligatorio (ya incluido en Vercel/Netlify por defecto)

### 1.3 Almacenamiento de Archivos
- [ ] Bucket S3/R2 en región `eu-central-1` o `eu-west-1`
- [ ] Cloudflare R2: seleccionar hint de región EU
- [ ] Supabase Storage: hereda la región del proyecto

### 1.4 Servicios de IA — ATENCIÓN ESPECIAL
- [ ] Verificar si el proveedor ofrece procesamiento en EU
- [ ] **OpenAI:** activar "Zero Data Retention" (requiere plan de pago + solicitud)
- [ ] **OpenRouter:** revisar política por modelo — algunos modelos procesan en US
- [ ] **Anthropic:** verificar términos de retención de datos
- [ ] Los tiers **gratuitos** de IA suelen usar datos para entrenamiento — incompatible con RGPD
- [ ] Opción: usar modelos open-source auto-hospedados en EU (Mistral, Llama)
- [ ] No enviar datos personales directos al modelo (anonimizar o pseudoanonimizar)

---

## FASE 2 — Base Jurídica del Tratamiento (Art. 6 RGPD)

Para cada tipo de dato que proceses, debes documentar la base legal:

- [ ] **Contrato (Art. 6.1.b):** datos necesarios para prestar el servicio (email, nombre para factura)
- [ ] **Obligación legal (Art. 6.1.c):** datos requeridos por ley (datos fiscales)
- [ ] **Interés legítimo (Art. 6.1.f):** cookies esenciales, seguridad, prevención de fraude
- [ ] **Consentimiento (Art. 6.1.a):** marketing, cookies no esenciales, newsletter
- [ ] Documentar en el Registro de Actividades de Tratamiento (RAT) qué base aplica a cada dato

---

## FASE 3 — Contratos con Encargados del Tratamiento (DPA)

### 3.1 Proveedores que requieren DPA
Para cada proveedor que procese datos de tus usuarios europeos:

- [ ] **Email:** Resend, SendGrid, Mailgun, Brevo — firmar DPA desde su panel
- [ ] **BD:** Neon, Supabase, PlanetScale — verificar DPA/ToS con cláusulas RGPD
- [ ] **Hosting:** Vercel, Netlify, Railway — tienen DPA disponible en configuración
- [ ] **Pagos:** Stripe (DPA automático), Paddle, Lemon Squeezy
- [ ] **Analytics:** Plausible (EU-hosted, sin cookies), Fathom, o desactivar GA
- [ ] **IA:** OpenAI, Anthropic, Mistral — revisar términos enterprise

### 3.2 Transferencias Internacionales (Art. 44-49 RGPD)
Si usas proveedores fuera de la UE (ej. empresa en México con BD en US):
- [ ] Usar **Cláusulas Contractuales Tipo (SCCs)** — disponibles en web de la Comisión Europea
- [ ] O verificar si el proveedor está en un país con decisión de adecuación
- [ ] Documentar todas las transferencias internacionales en el RAT

---

## FASE 4 — Documentos Legales

### 4.1 Política de Privacidad RGPD (más extensa que LFPDPPP)
Debe incluir adicionalmente:
- [ ] Base jurídica para cada finalidad del tratamiento
- [ ] Plazo de conservación de cada categoría de datos
- [ ] Listado de subencargados (proveedores que también procesan los datos)
- [ ] Derechos del interesado: acceso, rectificación, supresión, portabilidad, oposición, limitación
- [ ] Derecho a retirar el consentimiento en cualquier momento
- [ ] Derecho a reclamar ante la autoridad supervisora (AEPD en España)
- [ ] Si aplica: decisiones automatizadas y elaboración de perfiles

### 4.2 Política de Cookies (ePrivacy Directive)
- [ ] Banner de consentimiento **antes** de cargar cookies no esenciales
- [ ] Opciones granulares: esenciales / analytics / marketing
- [ ] Guardar evidencia del consentimiento (quién, cuándo, qué aceptó)
- [ ] Opción para retirar el consentimiento igual de fácil que darlo
- [ ] Cookies esenciales: no requieren consentimiento previo
- [ ] Renovar consentimiento cada 12 meses

### 4.3 Aviso Legal (LSSI — obligatorio en España)
- [ ] Nombre o razón social del titular
- [ ] Domicilio (o representante en UE si la empresa está fuera)
- [ ] Datos de contacto (email, teléfono)
- [ ] Número de inscripción en registro mercantil (si aplica)
- [ ] Ruta: `/aviso-legal`

### 4.4 Términos y Condiciones
- [ ] Ley aplicable: indicar si aplica ley española/europea además de mexicana
- [ ] Resolución de disputas: mediación o tribunales de la UE para clientes europeos
- [ ] Derechos del consumidor europeo (si vendes a personas físicas B2C)

---

## FASE 5 — Derechos de los Interesados (Art. 15-22 RGPD)

| Derecho | Plazo | Implementación técnica |
|---------|-------|----------------------|
| Acceso (Art. 15) | 30 días naturales | Exportar todos los datos del usuario en JSON/CSV |
| Rectificación (Art. 16) | 30 días naturales | Formulario de edición de perfil |
| Supresión / Olvido (Art. 17) | 30 días naturales | Eliminar TODOS los datos (con excepciones por retención) |
| Portabilidad (Art. 20) | 30 días naturales | Exportar datos en formato estructurado y legible |
| Oposición (Art. 21) | Inmediato | Desactivar procesamiento para marketing |
| Limitación (Art. 18) | 30 días naturales | Bloquear procesamiento sin eliminar |

- [ ] Implementar endpoint/función de exportación completa de datos del usuario
- [ ] Implementar borrado completo de datos (hard delete o anonimización)
- [ ] Canal de solicitud documentado (email privacidad@tuempresa.com)
- [ ] Registro interno de solicitudes recibidas y respondidas

---

## FASE 6 — Seguridad y Notificación de Brechas

### 6.1 Medidas de Seguridad (Art. 32 RGPD)
- [ ] Cifrado de datos en tránsito (HTTPS/TLS 1.3)
- [ ] Cifrado de datos en reposo
- [ ] Control de acceso y autenticación robusta
- [ ] Registro de auditoría de accesos a datos sensibles
- [ ] Plan de respuesta a incidentes documentado
- [ ] Copias de seguridad automáticas y probadas

### 6.2 Notificación de Brechas (Art. 33-34 RGPD)
- [ ] **72 horas:** notificar a la autoridad supervisora (AEPD si vendes en España)
- [ ] **Sin dilación:** notificar a los afectados si la brecha supone alto riesgo
- [ ] Documentar internamente todas las brechas, incluso las no notificables
- [ ] Tener redactada una plantilla de notificación de brecha

---

## FASE 7 — Registro de Actividades de Tratamiento (Art. 30 RGPD)

Documento interno (no público) obligatorio si tienes más de 250 empleados o procesas datos sensibles:

- [ ] Nombre y datos del responsable del tratamiento
- [ ] Finalidades del tratamiento
- [ ] Categorías de interesados y de datos
- [ ] Destinatarios (incluidos países terceros)
- [ ] Plazos previstos de supresión
- [ ] Descripción general de medidas de seguridad

Plantilla mínima: `docs/compliance/registro-actividades-tratamiento.md`

---

## FASE 8 — DPO (Delegado de Protección de Datos)

**¿Cuándo es obligatorio? (Art. 37 RGPD)**
- [ ] Eres autoridad u organismo público
- [ ] Realizas seguimiento sistemático a gran escala de personas
- [ ] Procesas categorías especiales de datos a gran escala (salud, religión, etc.)

**Para la mayoría de SaaS pequeños: NO es obligatorio**, pero es recomendable designar un punto de contacto interno.

- [ ] Si aplica: designar DPO (puede ser externo/consultor)
- [ ] Publicar datos de contacto del DPO en política de privacidad
- [ ] Registrar al DPO ante la AEPD (España)

---

## FASE 9 — Representante en la UE (Art. 27 RGPD)

**Si tu empresa está fuera de la UE (ej. México) y vendes a europeos:**
- [ ] Designar un representante establecido en la UE
- [ ] Puede ser una gestoría, abogado o servicio especializado en España/Alemania
- [ ] Publicar datos del representante en política de privacidad
- [ ] El representante actúa como punto de contacto ante autoridades

> Excepción: No obligatorio si el tratamiento es ocasional, no incluye datos sensibles a gran escala y es improbable que suponga riesgo para los derechos de las personas.

---

## FASE 10 — Facturación (España — si aplica)

### 10.1 Verifactu (obligatorio enero 2027)
- [ ] Sistema de facturación con firma electrónica por factura
- [ ] Encadenamiento hash (factura N incluye hash de factura N-1)
- [ ] Código QR verificable en cada factura
- [ ] Envío automático a la AEAT (Agencia Tributaria española)
- [ ] **Deadline:** Planificar implementación antes de octubre 2026

### 10.2 Ley Crea y Crece — Factura Electrónica B2B (2027)
- [ ] Facturación electrónica obligatoria entre empresas en formato **FacturaE**
- [ ] Integrar con plataforma pública AEAT o PAE (Punto de Acceso Electrónico)

---

## FASE 11 — Verificación Final

- [ ] Test completo del flujo de solicitud de supresión (derecho al olvido)
- [ ] Test del flujo de exportación de datos (portabilidad)
- [ ] Verificar que el banner de cookies funciona y guarda el consentimiento
- [ ] Confirmar que todos los DPA están firmados
- [ ] Confirmar región EU en BD, hosting y storage
- [ ] Confirmar que IA no retiene datos de usuarios
- [ ] Revisar que el Registro de Actividades de Tratamiento está actualizado
- [ ] Si aplica: representante en UE designado y publicado

---

## Herramientas y Recursos Útiles

| Recurso | URL |
|---------|-----|
| Texto completo RGPD | eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679 |
| AEPD (autoridad española) | aepd.es |
| Generador SCCs | ec.europa.eu/info/law/law-topic/data-protection |
| Plausible Analytics (RGPD-friendly) | plausible.io |
| Cookiebot (gestión de cookies) | cookiebot.com |
| DPA Vercel | vercel.com/legal/dpa |
| DPA Stripe | stripe.com/legal/dpa |

---

## Nota para Implementación en Nuevos SaaS

El código base de **SaaS Legal Shield** ya incluye la implementación técnica de México:
- Tabla `audit_logs` + `logAuditEvent()` → `src/features/compliance/actions.ts`
- Políticas de retención → `src/features/compliance/retention.ts`
- Panel de cumplimiento → `src/app/(main)/compliance/page.tsx`
- Política de cookies → `src/features/legal-shield/components/CookiePolicyView.tsx`
- Documentos legales → `src/features/legal-shield/components/LegalDocumentView.tsx`

Para Europa: adaptar los documentos legales con las secciones adicionales de este checklist y migrar la BD a región EU antes del primer cliente europeo.
