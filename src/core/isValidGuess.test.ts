import { describe, it, expect } from 'vitest';
import isValidGuess from './isValidGuess';

describe('isValidGuess', () => {
  it('Возвращает true для корректной попытки', () => {
    expect(isValidGuess(['1', '2', '3', '4'], 4, 10)).toBe(true);
  });

  it('Возвращает false, если длина не совпадает (короче)', () => {
    expect(isValidGuess(['1', '2', '3'], 4, 10)).toBe(false);
  });

  it('Возвращает false, если длина не совпадает (длиннее)', () => {
    expect(isValidGuess(['1', '2', '3', '4', '5'], 4, 10)).toBe(false);
  });

  it('Возвращает false для пустого массива', () => {
    expect(isValidGuess([], 4, 10)).toBe(false);
  });

  it('Возвращает false, если символ недопустим для base=2', () => {
    expect(isValidGuess(['0', '2'], 2, 2)).toBe(false);
  });

  it('Возвращает false, если символ недопустим для base=8', () => {
    expect(isValidGuess(['1', '8'], 2, 8)).toBe(false);
  });

  it('Возвращает false, если символ недопустим для base=10', () => {
    expect(isValidGuess(['1', 'a'], 2, 10)).toBe(false);
  });

  it('Возвращает true для hex-цифр a–f', () => {
    expect(isValidGuess(['a', 'f', '0', '9'], 4, 16)).toBe(true);
  });

  it('Возвращает true для hex-цифр A–F в верхнем регистре', () => {
    expect(isValidGuess(['A', 'F', '0', '9'], 4, 16)).toBe(true);
  });

  it('Возвращает false, если цифры повторяются', () => {
    expect(isValidGuess(['1', '2', '2', '3'], 4, 10)).toBe(false);
  });

  it('Возвращает false, если повторяются hex-цифры в разном регистре', () => {
    expect(isValidGuess(['a', 'A', '1', '2'], 4, 16)).toBe(false);
  });

  it('Возвращает true, если секрет начинается с 0', () => {
    expect(isValidGuess(['0', '1', '2', '3'], 4, 10)).toBe(true);
  });

  it('Возвращает true для минимальной длины length=2, base=2', () => {
    expect(isValidGuess(['0', '1'], 2, 2)).toBe(true);
  });

  it('Возвращает true для максимальной длины length=6, base=16', () => {
    expect(isValidGuess(['a', 'b', 'c', 'd', 'e', 'f'], 6, 16)).toBe(true);
  });

  it('Не мутирует переданный guess', () => {
    const guess = ['1', '2', '3', '4'];
    isValidGuess(guess, 4, 10);
    expect(guess).toEqual(['1', '2', '3', '4']);
  });
});