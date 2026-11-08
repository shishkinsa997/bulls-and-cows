export default function createDigitValidator(base: number): (char: string) => boolean {
  const BASE = '0123456789abcdef';
  const alphabet = BASE.slice(0, base);
  return (char) => {
    if (!char || char.length > 1) return false;
    const c = char.toLowerCase();
    return alphabet.includes(c);
  };
}
