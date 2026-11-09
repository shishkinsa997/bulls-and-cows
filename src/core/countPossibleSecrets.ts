const cache = new Map<string, number>();

export default function countPossibleSecrets(length: number, base: number): number {
  const key = `${length}:${base}`;
  if (cache.has(key)) return cache.get(key)!;

  if (length > base) return 0;
  if (length <= 0) return 1;

  const result = base * countPossibleSecrets(length - 1, base - 1);
  cache.set(key, result);

  return result;
}
