import {
  BadgeDollarSign,
  CloudSun,
  LockKeyhole,
  Plane,
  Radar,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { integrations } from '@/config/integrations';
import type { IntegrationAuth, IntegrationId } from '@/types/integration';

const icons = {
  amadeus: Plane,
  opensky: Radar,
  'open-meteo': CloudSun,
  frankfurter: BadgeDollarSign,
} satisfies Record<IntegrationId, typeof Plane>;

const authLabels: Record<IntegrationAuth, string> = {
  'server-secret': 'Credenciais no servidor',
  'optional-account': 'Conta opcional no servidor',
  public: 'Acesso público',
};

export function IntegrationsPanel() {
  return (
    <section
      id="integracoes"
      className="scroll-mt-24 space-y-6 py-8"
      aria-labelledby="integrations-title"
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Sprint 5
          </span>
          <h2
            id="integrations-title"
            className="mt-2 text-3xl font-bold tracking-tight"
          >
            Integrações preparadas com segurança
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Os contratos estão prontos para uma futura camada de backend.
            Nenhuma conexão externa está ativa nesta entrega.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
          <ServerCog className="size-4" /> 4 providers estruturados
        </div>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h3 className="font-semibold">
              Segredos nunca entram no aplicativo web
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Variáveis sem o prefixo{' '}
              <code className="rounded bg-muted px-1 py-0.5">VITE_</code>{' '}
              permanecem reservadas ao futuro backend. O provider mock continua
              sendo a fonte ativa.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = icons[integration.id];
          return (
            <Card key={integration.id}>
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Estrutura pronta
                  </span>
                </div>
                <div>
                  <CardTitle>{integration.name}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  {integration.serverOnly ? (
                    <LockKeyhole className="size-4 text-primary" />
                  ) : (
                    <ShieldCheck className="size-4 text-primary" />
                  )}
                  {authLabels[integration.auth]}
                </div>
                {integration.environmentVariables.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-2"
                    aria-label="Variáveis de ambiente necessárias"
                  >
                    {integration.environmentVariables.map((variable) => (
                      <code
                        key={variable}
                        className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        {variable}
                      </code>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma credencial prevista.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
