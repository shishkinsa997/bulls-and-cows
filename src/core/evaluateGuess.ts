interface IGuess {
  bulls: number;
  cows: number;
}
export default function evaluateGuess(secret: string[], guess: string[]): IGuess {
  const s = secret.map((c) => c.toLowerCase());
  const g = guess.map((c) => c.toLowerCase());
  const bullsChars = s.filter((char, i) => char === g[i]);
  const cows = g.reduce((cows, char, i) => {
    if (!bullsChars.includes(char) && s.includes(char) && !g.slice(0, i).includes(char)) cows++;
    return cows;
  }, 0);
  return { bulls: bullsChars.length, cows: cows };
}
