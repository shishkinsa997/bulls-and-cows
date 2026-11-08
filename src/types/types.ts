export type Child = HTMLElement | string | number | null | undefined | false;
export type ElementAttributes = Record<string, unknown>;

type Base = 2 | 8 | 10 | 16;
type Length = 2 | 3 | 4 | 5 | 6;

type Settings = { length: Length; base: Base };

type Attempt = {
  guess: string[];
  bulls: number;
  cows: number;
};

export type GameState = {
  settings: Settings;
  history: Attempt[];
  status: 'settings' | 'playing' | 'won';
  startTime: number | null;
  attempts: number;
  endTime: number | null;
  secret: string[] | null;
};

export type Listener = (state: GameState) => void;

export type Store = {
  getState: () => GameState;
  setState: (updater: (prev: GameState) => GameState) => void;
  subscribe: (listener: Listener) => () => void;
};