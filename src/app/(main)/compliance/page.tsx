import type { Metadata } from 'next';
import { getSessionUser } from '@/features/legal-shield/actions';
import { getAuditLogs } from '@/features/compliance/actions';
import { RETENTION_DAYS } from '@/features/compliance/retention';
import { Shield, Clock, Trash2, FilePlus, Info } from 'lucide-react';
import type { AuditLog } from '@/features/legal-shield/db/schema';

export const metadata: Metadata = {
  title: 'Cumplimiento — Legal Shield',
  description: 'Registro de auditoría y políticas de retención de datos.',
};

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  CREATE: { label: 'Creación', color: 'text-green-400' },
  DELETE: { label: 'Eliminación', color: 'text-red-400' },
  UPDATE: { label: 'Actualización', color: 'text-yellow-400' },
  LOGIN:  { label: 'Acceso', color: 'text-blue-400' },
};

const ENTITY_LABELS: Record<string, string> = {
  assessment: 'Evaluación',
  contract:   'Contrato',
  resource:   'Recurso',
  user:       'Usuario',
};

function RetentionCard({ entity, days }: { entity: string; days: number }) {
  const label = ENTITY_LABELS[entity] ?? entity;
  const years = days >= 365 ? `${Math.round(days / 365)} año${Math.round(days / 365) > 1 ? 's' : ''}` : `${days} días`;
  const legal = entity === 'contract'
    ? 'Art. 30 CFF — Obligación fiscal SAT'
    : entity === 'assessment'
    ? 'LFPDPPP — Registro de tratamiento'
    : 'Sin retención mínima';

  return (
    <div className="premium-card bg-bg-card border border-white/5 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-brand-primary" />
        <span className="font-black uppercase tracking-tight text-white text-sm">{label}s</span>
      </div>
      <p className="text-3xl font-black text-yellow-500">{days === 0 ? '—' : years}</p>
      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">{legal}</p>
    </div>
  );
}

function AuditRow({ log }: { log: AuditLog }) {
  const action = ACTION_LABELS[log.action] ?? { label: log.action, color: 'text-gray-400' };
  const entity = ENTITY_LABELS[log.entity] ?? log.entity;
  const date = new Date(log.createdAt).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
      <td className="py-3 px-4 text-[12px] text-gray-400 font-mono">{date}</td>
      <td className={`py-3 px-4 text-[12px] font-bold uppercase ${action.color}`}>{action.label}</td>
      <td className="py-3 px-4 text-[12px] text-gray-300">{entity}</td>
      <td className="py-3 px-4 text-[12px] font-mono text-gray-500">{log.entityId ?? '—'}</td>
      <td className="py-3 px-4 text-[12px] font-mono text-gray-600 truncate max-w-[200px]">
        {log.userId ? log.userId.slice(0, 8) + '…' : '—'}
      </td>
    </tr>
  );
}

export default async function CompliancePage() {
  const user = await getSessionUser();
  if (!user?.tenantId) {
    return (
      <div className="p-8 text-center text-gray-500">
        Debes iniciar sesión para ver esta sección.
      </div>
    );
  }

  const { data: logs } = await getAuditLogs(user.tenantId, 100);

  return (
    <div className="app-container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="text-brand-primary" size={28} />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
            Panel de Cumplimiento
          </h1>
          <p className="text-gray-500 text-sm">
            Registro de auditoría y políticas de retención — LFPDPPP 2026
          </p>
        </div>
      </div>

      {/* Retención */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">
          Retención Mínima de Datos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(RETENTION_DAYS).map(([entity, days]) => (
            <RetentionCard key={entity} entity={entity} days={days} />
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <Info size={16} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-yellow-500/80">
            El sistema bloquea la eliminación de registros que no hayan cumplido el periodo mínimo de retención.
            Los intentos de borrado antes de dicho plazo son rechazados automáticamente con el fundamento legal correspondiente.
          </p>
        </div>
      </section>

      {/* Audit Log */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary">
            Registro de Auditoría
          </h2>
          <span className="text-[11px] text-gray-500 font-bold uppercase">
            Últimas {logs.length} acciones
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="premium-card bg-bg-card border border-white/5 rounded-xl p-12 text-center">
            <FilePlus size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Aún no hay eventos registrados. Las acciones de creación y eliminación aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="premium-card bg-bg-card border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/2">
                    <th className="text-left py-3 px-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">Fecha</th>
                    <th className="text-left py-3 px-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">Acción</th>
                    <th className="text-left py-3 px-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">Entidad</th>
                    <th className="text-left py-3 px-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">ID</th>
                    <th className="text-left py-3 px-4 text-[11px] text-gray-500 font-bold uppercase tracking-widest">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <AuditRow key={log.id} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* DPA Resend */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-4">
          DPA — Encargados de Tratamiento
        </h2>
        <div className="premium-card bg-bg-card border border-white/5 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Trash2 size={14} className="text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Resend</p>
                <p className="text-[11px] text-gray-500">Servicio de envío de correos transaccionales</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-green-500/10 text-green-400">
                ✓ DPA Firmado
              </span>
            </div>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-[12px] text-gray-400">
            <p className="text-green-400 font-bold mb-1">Documento firmado y archivado</p>
            <p>Ubicación local: <span className="font-mono text-brand-primary">docs/legal/resend-dpa-signed.pdf</span></p>
            <p className="mt-1 text-gray-600">Excluido de git — no se sube al repositorio (contiene datos de empresa y firma).</p>
          </div>
        </div>
      </section>
    </div>
  );
}
