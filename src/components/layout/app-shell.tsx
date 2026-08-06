import { Menu, Plane } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';

import { ThemeToggle } from '@/components/theme/theme-toggle';

export function AppShell({ children }: { children: ReactNode }) {
  const appName = import.meta.env.VITE_APP_NAME ?? 'Caçador de Passagens';

  function closeMobileMenu(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.closest('details')?.removeAttribute('open');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-lg">
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
          <div className="flex items-center gap-1">
            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Navegação principal"
            >
              <a
                href="#buscar"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Buscar
              </a>
              <a
                href="#recursos"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Recursos
              </a>
              <a
                href="#minha-area"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Minha área
              </a>
              <a
                href="#sobre"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Sobre
              </a>
            </nav>
            <ThemeToggle />
            <details className="group relative md:hidden">
              <summary
                className="grid size-10 cursor-pointer list-none place-items-center rounded-md text-muted-foreground hover:bg-muted"
                aria-label="Abrir navegação"
              >
                <Menu className="size-5" />
              </summary>
              <nav
                className="absolute right-0 top-12 grid min-w-40 gap-1 rounded-xl border bg-background p-2 shadow-xl"
                aria-label="Navegação móvel"
              >
                <a
                  href="#buscar"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  Buscar
                </a>
                <a
                  href="#recursos"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  Recursos
                </a>
                <a
                  href="#minha-area"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  Minha área
                </a>
                <a
                  href="#sobre"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={closeMobileMenu}
                >
                  Sobre
                </a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main className="container flex-1 space-y-8 py-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {appName}. Planeje melhor. Viaje mais.
        </div>
      </footer>
    </div>
  );
}
