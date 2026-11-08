import createDigitValidator from './createDigitValidator';

export default function isValidGuess(guess: string[], length: number, base: number): boolean {
  const g = guess.map((char) => char.toLowerCase());
  if (g.length !== length) return false;
  if (g.length === 0) return false;
  if (new Set(g).size !== g.length) return false;

  const isValidDigit = createDigitValidator(base);
  return g.every(isValidDigit);
}
