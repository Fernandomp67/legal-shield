'use client';

import { Cookie, FileText } from 'lucide-react';
import { getTenantBranding } from '@/shared/lib/tenant-branding';

export function CookiePolicyView() {
  const branding = getTenantBranding();
  const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto premium-card bg-bg-card text-white p-6 sm:p-12 overflow-hidden">
      <div className="flex items-center gap-3 mb-8 border-b pb-6 border-white/5">
        <Cookie className="text-brand-primary" size={32} />
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
          Política de Cookies
        </h2>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
        <p className="font-bold text-yellow-500 uppercase tracking-widest text-[10px]">
          Última actualización: {today}
        </p>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            1. ¿Qué son las cookies?
          </h3>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando
            visita un sitio web. Permiten recordar información sobre su visita, como sus preferencias
            de idioma y otras configuraciones, lo que facilita su próxima visita.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            2. Cookies que utilizamos
          </h3>
          <p>
            <span className="text-white font-bold">{branding.name}</span> utiliza{' '}
            <span className="text-yellow-500 font-bold">únicamente cookies estrictamente necesarias</span>{' '}
            para el funcionamiento de la plataforma. No utilizamos cookies de rastreo, publicidad
            ni análisis de terceros.
          </p>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-brand-primary font-bold uppercase text-[11px] tracking-widest">Cookie</th>
                  <th className="text-left py-3 px-4 text-brand-primary font-bold uppercase text-[11px] tracking-widest">Tipo</th>
                  <th className="text-left py-3 px-4 text-brand-primary font-bold uppercase text-[11px] tracking-widest">Duración</th>
                  <th className="text-left py-3 px-4 text-brand-primary font-bold uppercase text-[11px] tracking-widest">Finalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-yellow-500 text-[12px]">authjs.session-token</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Esencial</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">Sesión</td>
                  <td className="py-3 px-4">Mantiene la sesión activa de forma segura (NextAuth)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-yellow-500 text-[12px]">authjs.csrf-token</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Esencial</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">Sesión</td>
                  <td className="py-3 px-4">Protección contra ataques CSRF (seguridad)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-yellow-500 text-[12px]">authjs.callback-url</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase">Esencial</span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">Sesión</td>
                  <td className="py-3 px-4">Redirige al usuario a la página correcta después del login</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            3. Base legal del tratamiento
          </h3>
          <p>
            El uso de estas cookies está amparado en el{' '}
            <span className="text-brand-primary font-bold">interés legítimo</span> de garantizar
            la seguridad y el funcionamiento correcto de la plataforma, conforme al{' '}
            <span className="text-yellow-500 font-bold">Artículo 6 de la LFPDPPP</span> (Ley
            Federal de Protección de Datos Personales en Posesión de los Particulares). Estas
            cookies son <span className="text-white font-bold">técnicamente indispensables</span> y
            no requieren consentimiento previo al ser esenciales para el servicio.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            4. Cookies de terceros
          </h3>
          <p>
            <span className="text-white font-bold">{branding.name}</span> actualmente{' '}
            <span className="text-yellow-500 font-bold underline decoration-brand-primary underline-offset-4">
              NO utiliza
            </span>{' '}
            cookies de terceros, servicios de analítica (Google Analytics, Mixpanel, etc.) ni
            píxeles de seguimiento publicitario.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            5. Cómo gestionar las cookies
          </h3>
          <p>
            Las cookies esenciales no pueden desactivarse sin afectar el funcionamiento de la
            plataforma. Puede eliminarlas desde la configuración de su navegador, pero esto
            cerrará su sesión activa. Consulte la ayuda de su navegador:
          </p>
          <ul className="space-y-2 mt-2">
            {[
              { name: 'Chrome', url: 'support.google.com/chrome/answer/95647' },
              { name: 'Firefox', url: 'support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies' },
              { name: 'Safari', url: 'support.apple.com/es-mx/guide/safari/sfri11471' },
              { name: 'Edge', url: 'support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies' },
            ].map((browser) => (
              <li key={browser.name} className="flex gap-3">
                <span className="text-brand-primary font-bold">●</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">{browser.name}:</span>{' '}
                  <span className="font-mono text-[12px] text-yellow-500">{browser.url}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-black text-white uppercase mb-2 border-l-4 border-brand-primary pl-4">
            6. Contacto
          </h3>
          <p>
            Para cualquier consulta sobre el uso de cookies puede contactarnos en:{' '}
            <span className="text-brand-primary font-bold">
              {branding.email || 'privacidad@tu-empresa.com'}
            </span>
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase">
        <p>Copyright © {new Date().getFullYear()} {branding.name}</p>
        <button
          className="flex items-center gap-2 hover:text-brand-primary transition-colors bg-white/5 py-2 px-4 rounded-lg border border-white/10"
          onClick={() => window.print()}
        >
          <FileText size={14} /> Imprimir copia
        </button>
      </div>
    </div>
  );
}
