'use server';

import { db } from '@/shared/lib/db';
import { desc, eq } from 'drizzle-orm';
import { auditLogs } from '@/features/legal-shield/db/schema';

/**
 * Registra un evento de auditoría en la base de datos.
 * Se llama internamente desde las Server Actions; nunca lanza error al exterior.
 */
export async function logAuditEvent({
  tenantId,
  userId,
  action,
  entity,
  entityId,
  metadata,
}: {
  tenantId: number;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      tenantId,
      userId,
      action,
      entity,
      entityId: entityId ?? null,
      metadata: metadata ?? null,
    });
  } catch (error) {
    // El audit log nunca debe bloquear la operación principal
    console.error('[AuditLog] Error al registrar evento:', error);
  }
}

/**
 * Retorna el historial de auditoría del tenant autenticado.
 * Solo lectura — para mostrar en la página /compliance.
 */
export async function getAuditLogs(tenantId: number, limit = 100) {
  try {
    const results = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.tenantId, tenantId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
    return { success: true, data: results };
  } catch (error) {
    console.error('[AuditLog] Error al consultar log:', error);
    return { success: false, data: [] };
  }
}
