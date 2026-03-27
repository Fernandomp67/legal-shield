# Respuesta a Jordi: Cómo gestionamos que el módulo de Docs Legal no alucine

> **Contexto:** Jordi pregunta cómo evitar que un módulo de documentación legal genere contenido alucinado, dado que tiene un system prompt de 700+ líneas con guardrails.

---

## La respuesta corta

**No usamos LLM para generar el contenido legal.**

Eso es el principio #1. Cualquier sistema que le pida a un LLM que "redacte una cláusula de responsabilidad" va a alucinar tarde o temprano. Nuestra solución fue eliminar ese vector de raíz.

---

## Arquitectura: Determinístico vs. Generativo

```
❌ Lo que NO hacemos:
Usuario → LLM → "Redacta un contrato SaaS conforme a LFPDPPP" → Documento

✅ Lo que SÍ hacemos:
Usuario → Formulario estructurado → Motor de reglas → Plantillas predefinidas → Documento
```

El módulo de Docs Legal tiene **15 documentos completos y ejecutables** escritos y validados una sola vez, almacenados como templates en TypeScript. El "AI" del sistema es un motor de reglas determinístico, no un LLM generando texto.

---

## Cómo funciona en detalle

### 1. Inputs controlados (sin texto libre en campos críticos)

El usuario no puede escribir "industria: tecnología legal avanzada". Selecciona de un dropdown:

```typescript
industry: 'Salud' | 'Fintech' | 'Legal' | 'Educación' | 'E-commerce' | 'Otro'
criticality: 'Bajo' | 'Medio' | 'Alto'
jurisdiction: 'México' | 'USA' | 'España' | 'Colombia'
```

TypeScript enums + dropdowns = cero texto libre en campos que afectan qué documentos se generan.

### 2. Motor de riesgo determinístico (matemáticas, no LLM)

```typescript
export function analyzeLegalRisk(input: AssessmentInput): LegalOutput {
  let riskScore = 10; // Base para todo SaaS

  if (industryLower.includes('salud')) {
    riskScore += 30;
    obligations.push('NOM-024-SSA3 (Expediente Clínico Electrónico)');
  }

  if (input.sensibleData) {
    riskScore += 35;
    obligations.push('Art. 9 LFPDPPP - Consentimiento expreso para datos sensibles');
  }
  // etc...
}
```

**Cada obligación es un string hardcodeado con su artículo de ley.** No hay LLM decidiendo qué obligaciones aplican.

### 3. Las 15 plantillas son contratos completos, no esqueletos

Cada plantilla tiene mínimo 12 cláusulas redactadas por humano:

| Doc | Documento | Cuándo aparece |
|-----|-----------|----------------|
| DOC_01 | Contrato Maestro MSSA | Siempre |
| DOC_02 | Aviso de Privacidad (LFPDPPP Arts. 15-18) | Si `personalData = true` |
| DOC_03 | Datos Sensibles + EIPD | Si `sensibleData = true` |
| DOC_05 | SLA (99.9% uptime, matriz S1-S4) | Si `hasSLA = true` |
| DOC_08 | DRP (RTO <4h, RPO <1h) | Si criticidad = 'Alto' |
| ... | 10 más | Condición booleana |

Cada template tiene una `condition: (data) => boolean`. Si no cumple, no aparece. Simple.

### 4. La "generación" es solo string.replace()

```typescript
const resolve = (text: string) => {
  return text
    .replace(/{{PROVEEDOR_RAZON_SOCIAL}}/g, data.providerLegalName)
    .replace(/{{JURISDICCION}}/g, data.jurisdiction || 'México')
    // ...
};
```

**No hay interpretación.** El LLM (si lo hubiera) no toca el contenido legal. Solo sustituimos variables con los datos del formulario.

---

## Dónde SÍ podría entrar un LLM (con guardrails reales)

Si en el futuro quisieras usar un LLM para algo específico (ej: adaptar una cláusula a un caso edge), el enfoque correcto no son 700 líneas de system prompt pidiendo que "no alucine". Es:

### Estrategia: RAG + Output estructurado + Verificación

```typescript
// En lugar de: "redacta una cláusula de privacidad"
// Haz esto:

const prompt = `
Dado este template base (LFPDPPP Art. 15):
${template_art15_lfpdppp}

Adapta SOLO los campos marcados con [ADAPTAR]:
- [ADAPTAR: tipo de datos que maneja el SaaS]
- [ADAPTAR: finalidad del tratamiento]

Responde en JSON:
{
  "campo_datos": "string",
  "finalidad": "string"
}

REGLA: Si no estás seguro, usa "REQUIERE_REVISION_LEGAL" como valor.
`;
```

**Por qué funciona mejor que 700 líneas:**
- El LLM solo llena campos específicos, no redacta contratos
- Output estructurado (JSON) → fácil de validar
- El texto legal base no lo toca el LLM
- Si el LLM dice "REQUIERE_REVISION_LEGAL" → alertas al usuario

---

## Disclaimer en múltiples capas

No basta con un disclaimer. Los nuestros están en:

1. **API response** (JSON explícito)
2. **Footer en cada página** (componente React)
3. **Página de Términos** (legal explícito)
4. **White-label configurable** por tenant

```typescript
// API response siempre incluye:
return NextResponse.json({
  assessment,
  disclaimer: 'No somos abogados. Esto es orientación automatizada basada en normativa pública mexicana 2026.'
});
```

---

## Resumen: El Anti-Patrón vs. El Patrón correcto

| ❌ Anti-patrón | ✅ Patrón correcto |
|----------------|-------------------|
| LLM genera texto legal libre | Templates pre-redactados por humano |
| 700 líneas de "no alucines" | Motor determinístico, no LLM |
| System prompt como guardrail | Inputs controlados (enums, dropdowns) |
| Un solo disclaimer | Disclaimer en API + UI + términos |
| LLM decide qué cláusulas incluir | Condiciones booleanas (if sensibleData → DOC_03) |

---

## Conclusión

La solución más robusta al problema de alucinaciones en contenido legal **es no usar LLM para el contenido legal**. El LLM puede estar en otros lugares del producto (búsqueda, resumen, onboarding), pero los documentos que tienen peso legal deben venir de templates validados por abogados, con el LLM haciendo sustitución de variables en el mejor caso.

Los 700 líneas de system prompt pueden ayudar en el margen, pero no son una garantía. La arquitectura determinística sí lo es.

---

*Espero que esto aclare el approach. Happy to go deeper en cualquiera de las capas.*
