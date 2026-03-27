import type { Metadata } from 'next';
import { CookiePolicyView } from '@/features/legal-shield/components/CookiePolicyView';

export const metadata: Metadata = {
  title: 'Política de Cookies — Legal Shield',
  description: 'Información sobre el uso de cookies en la plataforma Legal Shield conforme a la LFPDPPP.',
};

export default function PoliticaCookiesPage() {
  return <CookiePolicyView />;
}
