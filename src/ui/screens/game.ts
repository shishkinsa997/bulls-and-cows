import createDigitValidator from '../../core/createDigitValidator';
import evaluateGuess from '../../core/evaluateGuess';
import isValidGuess from '../../core/isValidGuess';
import type { GameState, Store } from '../../types/types';
import { el } from '../dom';

let timerInterval: number | undefined;

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const renderGame = (root: HTMLElement, state: GameState, store: Store): void => {
  if (timerInterval !== undefined) window.clearInterval(timerInterval);

  const { length, base } = state.settings;
  const guessInput = el('input', {
    id: 'guess',
    name: 'guess',
    type: 'text',
    inputMode: 'text',
    autoComplete: 'off',
    maxLength: length,
    required: true,
    'aria-label': `Enter ${length} unique digits`,
  });
  const message = el('p', { role: 'status', 'aria-live': 'polite' });
  const timer = el('output', { className: 'game-timer' });
  const form = el(
    'form',
    { className: 'guess-form' },
    el('label', { htmlFor: 'guess' }, `Your guess (${length} unique characters)`),
    guessInput,
    el('button', { type: 'submit', disabled: state.status === 'won' }, 'Guess'),
    message,
  );
  const historyList = el(
    'ol',
    { className: 'guess-history' },
    ...state.history.map((attempt, index) =>
      el(
        'li',
        {},
        `#${index + 1}: ${attempt.guess.join('')} — Bulls: ${attempt.bulls}, Cows: ${attempt.cows}`,
      ),
    ),
  );
  const elapsed = state.startTime === null ? 0 : (state.endTime ?? Date.now()) - state.startTime;

  timer.textContent = formatDuration(elapsed);

  guessInput.addEventListener('input', () => {
    const isValidDigit = createDigitValidator(base);
    const usedDigits = new Set<string>();
    const filteredValue = Array.from(guessInput.value)
      .filter((char) => {
        const digit = char.toLowerCase();
        if (!isValidDigit(char) || usedDigits.has(digit)) return false;
        usedDigits.add(digit);
        return true;
      })
      .slice(0, length)
      .join('');

    if (filteredValue !== guessInput.value) guessInput.value = filteredValue;
    message.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = Array.from(guessInput.value);
    if (!isValidGuess(guess, length, base)) {
      message.textContent = `Enter exactly ${length} unique digits valid for base ${base}.`;
      return;
    }

    const normalizedGuess = guess.map((digit) => digit.toLowerCase());
    if (
      state.history.some(
        (attempt) =>
          attempt.guess.map((digit) => digit.toLowerCase()).join('') === normalizedGuess.join(''),
      )
    ) {
      message.textContent = 'This guess has already been submitted.';
      return;
    }

    if (state.secret === null) {
      message.textContent = 'The game is not initialized. Return to settings and start a new game.';
      return;
    }

    const result = evaluateGuess(state.secret, guess);
    const won = result.bulls === length;
    store.setState((previous) => ({
      ...previous,
      history: [...previous.history, { guess, ...result }],
      attempts: previous.attempts + 1,
      endTime: won ? Date.now() : null,
      status: won ? 'won' : 'playing',
    }));
  });

  const newGameButton = el(
    'button',
    {
      type: 'button',
      onclick: () => {
        if (timerInterval !== undefined) window.clearInterval(timerInterval);
        store.setState((previous) => ({
          ...previous,
          history: [],
          attempts: 0,
          startTime: null,
          endTime: null,
          secret: null,
          status: 'settings',
        }));
      },
    },
    'New game',
  );

  root.append(
    el('h1', { textContent: state.status === 'won' ? 'You won!' : 'Bulls and Cows' }),
    el('p', {}, `Length: ${length}; base: ${base}`),
    el('p', {}, 'Time: ', timer),
    ...(state.status === 'won'
      ? [
          el(
            'p',
            { className: 'game-result' },
            `Solved in ${state.attempts} attempts and ${formatDuration(elapsed)}.`,
          ),
        ]
      : []),
    form,
    el('h2', { textContent: 'Guess history' }),
    historyList,
    newGameButton,
  );

  if (state.status === 'playing' && state.startTime !== null) {
    const startTime = state.startTime;
    timerInterval = window.setInterval(() => {
      timer.textContent = formatDuration(Date.now() - startTime);
    }, 1000);
  }
};
