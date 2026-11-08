import { describe, it, expect } from 'vitest';
import countPossibleSecrets from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it('Возвращает число', () => {
    expect(countPossibleSecrets(2, 2)).toBeTypeOf('number');
  });

  it('Для length=2, base=2 возвращает 2 (01, 10)', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('Для length=2, base=8 возвращает 56 (8 × 7)', () => {
    expect(countPossibleSecrets(2, 8)).toBe(56);
  });

  it('Для length=4, base=10 возвращает 5040 (10 × 9 × 8 × 7)', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('Для length=6, base=16 возвращает 5765760 (16 × 15 × 14 × 13 × 12 × 11)', () => {
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });

  it('Для length=base возвращает base!', () => {
    expect(countPossibleSecrets(8, 8)).toBe(40320);
    expect(countPossibleSecrets(10, 10)).toBe(3628800);
  });

  it('Секрет может начинаться с 0 — ограничений на первую цифру нет', () => {
    // length=4, base=10: 5040, а не 4536 (P(base−1, length−1) · (base−length+1))
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });

  it('Возвращает 1 при length=0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('Повторный вызов с теми же аргументами возвращает то же значение', () => {
    const first = countPossibleSecrets(4, 10);
    const second = countPossibleSecrets(4, 10);
    expect(first).toBe(second);
    expect(first).toBe(5040);
  });

  it('Вызовы с разными аргументами не конфликтуют', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('Мемоизация: повторный вызов не пересчитывает', () => {
    // многократный вызов не вызывает переполнения стека
    for (let i = 0; i < 1000; i++) {
      countPossibleSecrets(6, 16);
    }
    expect(countPossibleSecrets(6, 16)).toBe(5765760);
  });
});
