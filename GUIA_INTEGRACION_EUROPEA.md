# Guía de Integración de Documentación Europea como Fuente de Verdad

Esta guía detalla cómo modificar el repositorio `legal-shield` para que utilice PDFs de legislación europea como base fundamental, respetando la jerarquía temporal (leyes posteriores derogan anteriores).

## 1. Carpeta para los PDFs
Debes crear una nueva carpeta dedicada exclusivamente a la documentación europea original. Esto permite separar la lógica del motor de la base documental cruda.

**Ruta recomendada:** `/home/ubuntu/legal-shield/knowledge_base/eu-legislation/`

> **Nota:** Dentro de esta carpeta, te sugiero organizar los archivos con un prefijo de fecha (ISO 8601) para facilitar la gestión de prioridades:
> - `2016-04-27_RGPD_Original.pdf`
> - `2021-10-15_Correccion_Errores_RGPD.pdf` (Esta primará sobre la anterior en puntos específicos)

---

## 2. Archivos a Modificar

Para que el sistema "tome como base de verdad" estos documentos y no invente nada, debes intervenir en tres puntos clave:

### A. `legal-kb.json` (Base de Conocimiento Estructurada)
Este archivo actúa como el "índice" que la IA consulta. Debes añadir una sección de metadatos para cada documento europeo que subas.

**Modificación:** Añade un array `eu_sources` con la fecha de vigencia y el estado (vigente/derogado).
```json
{
  "eu_sources": [
    {
      "id": "rgpd_2016",
      "file": "2016-04-27_RGPD_Original.pdf",
      "version_date": "2016-04-27",
      "priority": 1,
      "status": "active"
    },
    {
      "id": "rgpd_corrigendum_2021",
      "file": "2021-10-15_Correccion_RGPD.pdf",
      "version_date": "2021-10-15",
      "priority": 2,
      "status": "active",
      "overrides": ["rgpd_2016"]
    }
  ]
}
```

### B. `src/features/legal-shield/lib/legal-shield-engine.ts` (Motor de Lógica)
Debes modificar la función `analyzeLegalRisk` para que, cuando la jurisdicción sea "España" o "UE", el sistema no use sus reglas internas genéricas, sino que invoque una validación contra la base de datos de PDFs.

**Cambio sugerido:**
1. Importar la lista de fuentes europeas.
2. Implementar una lógica de "Filtro Temporal": Antes de emitir una obligación, el motor debe verificar si existe un documento con `version_date` posterior que modifique ese artículo.

### C. `src/app/api/legal-assessment/route.ts` (Capa de IA)
Para impedir que la IA invente (alucinaciones), debes modificar el **System Prompt** que se envía al modelo (Claude/Gemini). 

**Instrucción de "Grounding":**
> "Actúa únicamente basándote en los documentos listados en `knowledge_base/eu-legislation/`. Si una ley posterior (por fecha) contradice a una anterior, utiliza SIEMPRE la información del documento más reciente. Si la respuesta no está en estos documentos, responde: 'Información no disponible en la base documental europea'."

---

## 3. Estrategia de Prioridad Temporal (Derogaciones)

Para asegurar que las correcciones posteriores primen, el sistema debe seguir este flujo lógico:

1. **Carga de Documentos:** El sistema lee todos los archivos en `eu-legislation`.
2. **Ordenación:** Los ordena por `version_date` de forma descendente.
3. **Validación de Conflictos:** Si el usuario pregunta por un artículo (ej. Art. 13 RGPD), el sistema busca primero en el documento más reciente. Solo si no hay cambios allí, baja al siguiente nivel.
4. **Etiquetado de Derogación:** En `legal-kb.json`, usa el campo `"overrides": ["id_anterior"]` para marcar explícitamente qué documentos quedan sin efecto total o parcial.

---

## 4. Pasos para Implementar Ahora

1. **Sube tus PDFs** a `/knowledge_base/eu-legislation/`.
2. **Actualiza `legal-kb.json`** con las rutas y fechas de esos archivos.
3. **Ajusta el Prompt** en el archivo de la API para forzar el uso exclusivo de esos documentos.
4. **Prueba el sistema** preguntando por un punto que sepas que ha sido corregido recientemente para verificar que toma la versión nueva.
