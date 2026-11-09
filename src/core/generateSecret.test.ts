import { describe, it, expect } from 'vitest';
import generateSecret from './generateSecret';

const BASE = {
  bin: '01',
  oct: '01234567',
  dec: '0123456789',
  hex: '0123456789abcdef',
};

const randomSequence = (values: number[]) => {
  let i = 0;

  return (): number => {
    const value = values[i % values.length];
    i++;
    return value ?? 0;
  };
};

describe('generateSecret', () => {
  it('Возвращает результат длины length', () => {
    expect(generateSecret(4, 10)).toHaveLength(4);
  });
  it('Возвращает массив уникальных символов без повторов', () => {
    const result = generateSecret(6, 16);
    const set = new Set(result);
    expect(Array.isArray(result)).toEqual(true);
    expect(set.size).toEqual(result.length);
  });
  it('Содержит только символы алфавита base=2 (0, 1)', () => {
    expect(generateSecret(2, 2).every((char) => BASE.bin.includes(char))).toBeTruthy();
  });
  it('Содержит только символы алфавита base=8 (0–7)', () => {
    expect(generateSecret(6, 8).every((char) => BASE.oct.includes(char))).toBeTruthy();
  });
  it('Содержит только символы алфавита base=10 (0–9)', () => {
    expect(generateSecret(6, 10).every((char) => BASE.dec.includes(char))).toBeTruthy();
  });
  it('Содержит только символы алфавита base=16 (0–9, a–f)', () => {
    expect(generateSecret(6, 16).every((char) => BASE.hex.includes(char))).toBeTruthy();
  });
  it('Приводит hex-символы к нижнему регистру', () => {
    expect(generateSecret(6, 16).every((char) => char === char.toLowerCase())).toBeTruthy();
  });
  it('Использует переданный random вместо Math.random', () => {
    expect(generateSecret(4, 10, randomSequence([0.1, 0.2, 0.3, 0.4]))).toEqual([
      '1',
      '2',
      '3',
      '4',
    ]);
  });
  it('Возвращает детерминированный результат при фиксированном random', () => {
    expect(generateSecret(2, 2, randomSequence([0.9, 0.1]))).toEqual(['1', '0']);
  });
  it('Не ломает уникальность при повторных значениях random', () => {
    const result = generateSecret(2, 10, randomSequence([0.1, 0.1, 0.1, 0.9, 0.9]));
    expect(new Set(result).size).toBe(2);
    expect(result.every((char) => BASE.dec.includes(char))).toBe(true);
  });
  it('Возвращает все символы алфавита при length === base', () => {
    expect(generateSecret(2, 2)).toHaveLength(BASE.bin.length);
  });
});
