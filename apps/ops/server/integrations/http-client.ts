const TIMEOUT_MS = 8_000;

export async function fetchJson(
  url: string,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`upstream HTTP ${response.status}`);
  return response.json();
}

export async function fetchText(
  url: string,
  init?: RequestInit,
): Promise<string> {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`upstream HTTP ${response.status}`);
  return response.text();
}

export const INTEGRATION_TIMEOUT_MS = TIMEOUT_MS;
