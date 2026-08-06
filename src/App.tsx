import { Compass, Layers3, Plane, ShieldCheck } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const foundations = [
  {
    icon: Layers3,
    title: 'Base consistente',
    description:
      'React, Vite e TypeScript configurados para evoluir com segurança.',
  },
  {
    icon: Compass,
    title: 'Interface preparada',
    description:
      'Tailwind CSS e componentes shadcn/ui prontos para a próxima etapa.',
  },
  {
    icon: ShieldCheck,
    title: 'Qualidade desde o início',
    description: 'Lint, formatação e validação de tipos integrados ao projeto.',
  },
];

export default function App() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-700 px-6 py-14 text-white shadow-xl sm:px-10 lg:px-14">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
            <Plane className="size-4" />
            Fundação concluída
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Sua próxima viagem começa com uma base sólida.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-teal-50">
            O Caçador de Passagens está pronto para receber a interface de
            pesquisa na Sprint 2.
          </p>
        </div>
      </section>

      <section
        className="grid gap-4 md:grid-cols-3"
        aria-label="Fundação técnica"
      >
        {foundations.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <div className="mb-2 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
