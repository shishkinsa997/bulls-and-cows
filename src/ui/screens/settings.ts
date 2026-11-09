import { el } from '../dom';
import countPossibleSecrets from '../../core/countPossibleSecrets';
import generateSecret from '../../core/generateSecret';
import type { GameState, Store } from '../../types/types';
import { createIcon } from '../icons';
import { Play, Sparkles } from 'lucide';
import { renderLeaderboard } from '../leaderboard';

const bases = [
  { value: 2, label: 'Binary (bin)' },
  { value: 8, label: 'Octal (oct)' },
  { value: 10, label: 'Decimal (dec)' },
  { value: 16, label: 'Hexadecimal (hex)' },
] as const;

const lengths = [2, 3, 4, 5, 6] as const;

export const renderSettings = (root: HTMLElement, state: GameState, store: Store): void => {
  const { base, length } = state.settings;
  const heading = el('h1', { className: 'screen-heading' }, 'Bulls & Cows');
  heading.prepend(createIcon(Sparkles));

  const startButton = el(
    'button',
    {
      type: 'submit',
      className: 'button button--primary',
    },
    'Start game',
  );
  startButton.prepend(createIcon(Play));

  const form = el(
    'form',
    { className: 'settings-form' },
    el('label', { htmlFor: 'base' }, 'Number system'),
    el(
      'select',
      {
        className: 'settings-control',
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
        className: 'settings-control',
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
    startButton,
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

  const subtitle = el(
    'p',
    { className: 'screen-subtitle' },
    'Choose your number system and secret length, then crack the code.',
  );
  root.append(
    el(
      'section',
      { className: 'screen settings-screen' },
      heading,
      subtitle,
      form,
      renderLeaderboard(),
    ),
  );
};
