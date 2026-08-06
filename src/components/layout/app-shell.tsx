import { Plane } from 'lucide-react';
import type { ReactNode } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';

export function AppShell({ children }: { children: ReactNode }) {
  const appName = import.meta.env.VITE_APP_NAME ?? 'Caçador de Passagens';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-3"
            aria-label={`${appName} — início`}
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold leading-tight">
                {appName}
              </span>
              <span className="block text-xs text-muted-foreground">
                Planeje melhor. Viaje mais.
              </span>
            </span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="container flex-1 space-y-8 py-8">{children}</main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {appName}. Fundação da Sprint 1.
        </div>
      </footer>
    </div>
  );
}
