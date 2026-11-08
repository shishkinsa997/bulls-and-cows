import { el } from '../dom';
import type { GameState, Store } from '../../types/types';

export const renderSettings = (root: HTMLElement, _state: GameState, _store: Store) => {
  root.append(el('h1', { textContent: 'Settings' }));
};
