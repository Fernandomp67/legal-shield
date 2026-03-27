// Lógica de retención — sin 'use server', puede importarse desde cualquier contexto

// Retención mínima por tipo de entidad (días)
// - Assessments: 365 días — LFPDPPP, registro de tratamiento de datos
// - Contratos:  1825 días — Art. 30 CFF, obligación fiscal SAT (5 años)
export const RETENTION_DAYS: Record<string, number> = {
  assessment: 365,
  contract: 1825,
  resource: 0,
};

export function checkRetentionPolicy(
  entityType: string,
  createdAt: Date
): { allowed: boolean; reason?: string } {
  const minDays = RETENTION_DAYS[entityType] ?? 0;
  if (minDays === 0) return { allowed: true };

  const ageDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  if (ageDays < minDays) {
    const remaining = minDays - ageDays;
    const fundamento =
      entityType === 'contract'
        ? 'Art. 30 CFF — obligación fiscal SAT 5 años'
        : 'LFPDPPP — registro de tratamiento de datos 1 año';
    return {
      allowed: false,
      reason: `Este registro no puede eliminarse aún. Retención mínima: ${minDays} días (restan ${remaining} días). Fundamento: ${fundamento}.`,
    };
  }

  return { allowed: true };
}
