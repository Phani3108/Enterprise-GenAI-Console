import type { Scenario } from '@/store/scenarioStore';

export function encodeScenario(scenario: Scenario): string {
  return encodeURIComponent(JSON.stringify(scenario));
}

export function decodeScenario(encoded: string): Scenario | null {
  try {
    return JSON.parse(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}

export function buildModuleUrl(
  basePort: number,
  path: string,
  scenario: Scenario,
  consoleRoute: string
): string {
  const params = new URLSearchParams();
  params.set('embed', '1');
  params.set('theme', 'console-darklabs');
  params.set('scenario', JSON.stringify(scenario));
  params.set('returnUrl', `http://localhost:3000${consoleRoute}`);
  return `http://localhost:${basePort}${path}?${params.toString()}`;
}

export function getModuleOrigin(port: number): string {
  return `http://localhost:${port}`;
}
