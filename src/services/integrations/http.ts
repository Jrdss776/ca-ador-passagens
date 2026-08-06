const DEFAULT_TIMEOUT_MS = 6_000;

export async function fetchJson<T>(
  url: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Resposta HTTP ${response.status}.`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}
