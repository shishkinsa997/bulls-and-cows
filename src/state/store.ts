import type { GameState, Listener, Store } from './../types/types';

export const initialState: GameState = {
  settings: { length: 4, base: 10 },
  history: [],
  status: 'settings',
  startTime: null,
  attempts: 0,
  endTime: null,
  secret: null,
};

export const createStore = (initial: GameState = initialState): Store => {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    getState: (): GameState => state,
    setState: (updater: (prev: GameState) => GameState): void => {
      state = updater(state);
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
};