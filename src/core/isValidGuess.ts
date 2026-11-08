export default function isValidGuess(guess: string[], length: number, base: number): boolean {
  const BASE = '0123456789abcdef';
  const g = guess.map((char) => char.toLowerCase());
  if (g.length !== length) return false;
  if (g.length === 0) return false;
  if (new Set(g).size !== g.length) return false;
  return g.every((char) => BASE.slice(0, base).includes(char.toLowerCase()));
}
