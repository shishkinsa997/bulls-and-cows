export default function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string[] {
  const BASE = '0123456789abcdef';
  const secret = new Set<string>();
  while (secret.size < length) {
    const index: number = Math.floor(random() * base);
    secret.add(BASE[index]!);
  }
  return Array.from(secret);
}
