import { describe, it, expect, vi } from 'vitest';
import { createStore, initialState } from './store';
import type { GameState } from '../types/types';

describe('createStore', () => {
  describe('getState', () => {
    it('Возвращает initialState по умолчанию', () => {
      const store = createStore();
      expect(store.getState()).toBe(initialState);
    });

    it('Возвращает переданное начальное состояние', () => {
      const custom: GameState = {
        ...initialState,
        status: 'playing',
        startTime: 123,
      };
      const store = createStore(custom);
      expect(store.getState()).toBe(custom);
    });
  });

  describe('setState', () => {
    it('Обновляет состояние через updater', () => {
      const store = createStore();
      store.setState((prev) => ({ ...prev, attempts: 5 }));
      expect(store.getState().attempts).toBe(5);
    });

    it('Передаёт актуальное состояние в updater', () => {
      const store = createStore();
      store.setState((prev) => ({ ...prev, attempts: 1 }));
      store.setState((prev) => ({ ...prev, attempts: prev.attempts + 1 }));
      expect(store.getState().attempts).toBe(2);
    });

    it('Не мутирует предыдущий объект состояния', () => {
      const store = createStore();
      const before = store.getState();
      store.setState((prev) => ({ ...prev, attempts: 7 }));
      const after = store.getState();
      expect(before).not.toBe(after);
      expect(before.attempts).toBe(0);
      expect(after.attempts).toBe(7);
    });

    it('Сохраняет ссылку на состояние, если updater вернул prev', () => {
      const store = createStore();
      const before = store.getState();
      store.setState((prev) => prev);
      expect(store.getState()).toBe(before);
    });
  });

  describe('subscribe', () => {
    it('Вызывает listener при каждом setState', () => {
      const store = createStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState((prev) => ({ ...prev, attempts: 1 }));
      store.setState((prev) => ({ ...prev, attempts: 2 }));

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('Передаёт новое состояние в listener', () => {
      const store = createStore();
      const listener = vi.fn();
      store.subscribe(listener);

      store.setState((prev) => ({ ...prev, attempts: 3 }));

      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ attempts: 3 }));
    });

    it('Поддерживает несколько подписчиков', () => {
      const store = createStore();
      const a = vi.fn();
      const b = vi.fn();
      store.subscribe(a);
      store.subscribe(b);

      store.setState((prev) => ({ ...prev, attempts: 1 }));

      expect(a).toHaveBeenCalledTimes(1);
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('Возвращает функцию отписки', () => {
      const store = createStore();
      const unsubscribe = store.subscribe(vi.fn());
      expect(typeof unsubscribe).toBe('function');
    });

    it('После отписки listener больше не вызывается', () => {
      const store = createStore();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.setState((prev) => ({ ...prev, attempts: 1 }));
      unsubscribe();
      store.setState((prev) => ({ ...prev, attempts: 2 }));

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('Отписка одного не влияет на других подписчиков', () => {
      const store = createStore();
      const a = vi.fn();
      const b = vi.fn();
      const unsubscribeA = store.subscribe(a);
      store.subscribe(b);

      unsubscribeA();
      store.setState((prev) => ({ ...prev, attempts: 1 }));

      expect(a).not.toHaveBeenCalled();
      expect(b).toHaveBeenCalledTimes(1);
    });

    it('Повторный вызов unsubscribe безопасен', () => {
      const store = createStore();
      const unsubscribe = store.subscribe(vi.fn());
      expect(() => {
        unsubscribe();
        unsubscribe();
      }).not.toThrow();
    });
  });
});
