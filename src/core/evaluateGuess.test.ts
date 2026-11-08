import { describe, it, expect } from 'vitest';
import evaluateGuess from './evaluateGuess';

describe('evaluateGuess', () => {
  it('Возвращает объект с полями bulls и cows', () => {
    expect(evaluateGuess(['1', '0'], ['0', '1'])).toHaveProperty('bulls');
    expect(evaluateGuess(['1', '0'], ['0', '1'])).toHaveProperty('cows');
    expect(Object.keys(evaluateGuess(['1', '0'], ['0', '1']))).toHaveLength(2);
  });

  it('Возвращает { bulls: 0, cows: 0 }, если совпадений нет', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['5', '6', '7', '8'])).toEqual({
      bulls: 0,
      cows: 0,
    });
  });

  it('Возвращает bulls === length при полностью угаданном секрете', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '2', '3', '4'])).toEqual({
      bulls: 4,
      cows: 0,
    });
  });

  it('Считает bulls при частичном совпадении позиций', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '5', '3', '8'])).toEqual({
      bulls: 2,
      cows: 0,
    });
  });

  it('Считает cows, когда все цифры есть, но не на своих местах', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['4', '3', '2', '1'])).toEqual({
      bulls: 0,
      cows: 4,
    });
  });

  it('Правильно считает смесь bulls и cows', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '3', '5', '2'])).toEqual({
      bulls: 1,
      cows: 2,
    });
  });

  it('Не считает одну и ту же цифру секрета дважды', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], ['1', '1', '1', '1'])).toEqual({
      bulls: 1,
      cows: 0,
    });
    expect(evaluateGuess(['1', '2', '3', '4'], ['2', '1', '1', '4'])).toEqual({
      bulls: 1,
      cows: 2,
    });
  });

  it('Сравнивает hex-символы без учёта регистра', () => {
    expect(evaluateGuess(['a', 'b', 'c', 'd'], ['A', 'B', '5', '6'])).toEqual({
      bulls: 2,
      cows: 0,
    });
  });

  it('Корректно работает, когда секрет начинается с 0', () => {
    expect(evaluateGuess(['0', '1', '2', '3'], ['0', '1', '2', '3'])).toEqual({
      bulls: 4,
      cows: 0,
    });
  });

  it('Не мутирует переданные secret и guess', () => {
    const secret = ['1', '2', '3', '4'];
    const guess = ['1', '3', '2', '4'];
    evaluateGuess(secret, guess);
    expect(secret).toEqual(['1', '2', '3', '4']);
    expect(guess).toEqual(['1', '3', '2', '4']);
  });
});