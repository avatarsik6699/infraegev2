export function resolveCredential(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing credential environment variable: ${name}`);
  return value;
}
