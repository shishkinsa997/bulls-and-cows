import { el } from '../dom';
import countPossibleSecrets from '../../core/countPossibleSecrets';
import generateSecret from '../../core/generateSecret';
import type { GameState, Store } from '../../types/types';

const bases = [
  { value: 2, label: 'Binary (bin)' },
  { value: 8, label: 'Octal (oct)' },
  { value: 10, label: 'Decimal (dec)' },
  { value: 16, label: 'Hexadecimal (hex)' },
] as const;

const lengths = [2, 3, 4, 5, 6] as const;

export const renderSettings = (root: HTMLElement, state: GameState, store: Store): void => {
  const { base, length } = state.settings;
  const form = el(
    'form',
    { className: 'settings-form' },
    el('label', { htmlFor: 'base' }, 'Number system'),
    el(
      'select',
      {
        id: 'base',
        name: 'base',
        onchange: (event: Event) => {
          const selectedBase = bases.find(
            (option) => option.value === Number((event.currentTarget as HTMLSelectElement).value),
          );
          if (!selectedBase) return;

          store.setState((previous) => ({
            ...previous,
            settings: {
              ...previous.settings,
              base: selectedBase.value,
              length: Math.min(
                previous.settings.length,
                selectedBase.value,
              ) as GameState['settings']['length'],
            },
          }));
        },
      },
      ...bases.map((option) =>
        el(
          'option',
          {
            value: option.value,
            selected: base === option.value,
          },
          option.label,
        ),
      ),
    ),
    el('label', { htmlFor: 'length' }, 'Secret length'),
    el(
      'select',
      {
        id: 'length',
        name: 'length',
        onchange: (event: Event) => {
          const selectedLength = lengths.find(
            (option) => option === Number((event.currentTarget as HTMLSelectElement).value),
          );
          if (selectedLength === undefined || selectedLength > base) return;

          store.setState((previous) => ({
            ...previous,
            settings: { ...previous.settings, length: selectedLength },
          }));
        },
      },
      ...lengths.map((option) =>
        el(
          'option',
          {
            value: option,
            selected: length === option,
            disabled: option > base,
          },
          option,
        ),
      ),
    ),
    el(
      'p',
      { className: 'possible-secrets' },
      `Possible secrets: ${countPossibleSecrets(length, base)}`,
    ),
    el('button', { type: 'submit' }, 'Start game'),
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    store.setState((previous) => ({
      ...previous,
      history: [],
      attempts: 0,
      startTime: Date.now(),
      endTime: null,
      secret: generateSecret(previous.settings.length, previous.settings.base),
      status: 'playing',
    }));
  });

  root.append(el('h1', { textContent: 'Bulls and Cows' }), form);
};
