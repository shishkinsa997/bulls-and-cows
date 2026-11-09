import { describe, it, expect } from 'vitest';
import createDigitValidator from './createDigitValidator';

describe('createDigitValidator', () => {
  it('Возвращает функцию', () => {
    expect(createDigitValidator(10)).toBeTypeOf('function');
  });

  it('Возвращённая функция возвращает boolean', () => {
    const validate = createDigitValidator(10);
    expect(validate('a')).toBeTypeOf('boolean');
  });

  it('Для base=2 принимает 0 и 1', () => {
    const validate = createDigitValidator(2);
    expect(validate('0')).toBeTruthy();
    expect(validate('1')).toBeTruthy();
  });

  it('Для base=2 отвергает 2 и выше', () => {
    const validate = createDigitValidator(2);
    expect(validate('2')).toBeFalsy();
    expect(validate('9')).toBeFalsy();
  });

  it('Для base=8 принимает 0–7 и отвергает 8, 9', () => {
    const validate = createDigitValidator(8);
    expect(validate('0')).toBeTruthy();
    expect(validate('7')).toBeTruthy();
    expect(validate('8')).toBeFalsy();
    expect(validate('9')).toBeFalsy();
  });

  it('Для base=10 принимает 0–9 и отвергает a', () => {
    const validate = createDigitValidator(10);
    expect(validate('5')).toBeTruthy();
    expect(validate('9')).toBeTruthy();
    expect(validate('a')).toBeFalsy();
  });

  it('Для base=16 принимает 0–9 и a–f', () => {
    const validate = createDigitValidator(16);
    expect(validate('0')).toBeTruthy();
    expect(validate('9')).toBeTruthy();
    expect(validate('a')).toBeTruthy();
    expect(validate('f')).toBeTruthy();
  });

  it('Для base=16 принимает hex-цифры в верхнем регистре', () => {
    const validate = createDigitValidator(16);
    expect(validate('A')).toBeTruthy();
    expect(validate('F')).toBeTruthy();
  });

  it('Для base=16 отвергает символы вне алфавита (g, z, спецсимволы)', () => {
    const validate = createDigitValidator(16);
    expect(validate('g')).toBeFalsy();
    expect(validate('z')).toBeFalsy();
    expect(validate('-')).toBeFalsy();
    expect(validate(' ')).toBeFalsy();
  });

  it('Отвергает пустую строку', () => {
    expect(createDigitValidator(10)('')).toBeFalsy();
  });

  it('Отвергает строку длиннее одного символа', () => {
    expect(createDigitValidator(10)('12')).toBeFalsy();
  });

  it('Два валидатора с разными base независимы', () => {
    const validateBin = createDigitValidator(2);
    const validateDec = createDigitValidator(10);
    expect(validateBin('5')).toBeFalsy();
    expect(validateDec('5')).toBeTruthy();
  });

  it('Каррирование: createDigitValidator(16)("f") работает в одну цепочку', () => {
    expect(createDigitValidator(16)('f')).toBeTruthy();
  });

  it('Возвращает новую функцию при каждом вызове', () => {
    const a = createDigitValidator(10);
    const b = createDigitValidator(10);
    expect(a).not.toBe(b);
  });
});
