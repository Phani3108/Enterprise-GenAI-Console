import modules from '@/data/modules.json';

export interface ModuleConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  port: number;
  path: string;
  tool: string;
  route: string;
  repo: string;
}

export function getModules(): ModuleConfig[] {
  return modules as ModuleConfig[];
}

export function getModuleById(id: string): ModuleConfig | undefined {
  return (modules as ModuleConfig[]).find((m) => m.id === id);
}

export function getModuleUrl(mod: ModuleConfig, embed = true): string {
  const embedParam = embed ? '?embed=1' : '';
  return `http://localhost:${mod.port}${mod.path}${embedParam}`;
}
