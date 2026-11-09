import createDigitValidator from '../../core/createDigitValidator';
import evaluateGuess from '../../core/evaluateGuess';
import isValidGuess from '../../core/isValidGuess';
import type { GameState, Store, RecordStore } from '../../types/types';
import { createIcon } from '../icons';
import { el } from '../dom';
import { ArrowLeft, Clock3, Hash, History, Medal, Send, Sparkles, Target } from 'lucide';
import storage from '../../state/storage';
import { renderLeaderboard } from '../leaderboard';

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
  const isValidDigit = createDigitValidator(base);
  const message = el('p', {
    className: 'guess-message',
    id: 'guess-message',
    role: 'status',
    'aria-live': 'polite',
  });
  const guessCells = Array.from({ length }, (_, index) =>
    el('input', {
      className: 'guess-input',
      type: 'text',
      inputMode: base === 16 ? 'text' : 'numeric',
      autoComplete: 'off',
      maxLength: 1,
      disabled: state.status === 'won',
      'aria-label': `Digit ${index + 1} of ${length}`,
      'aria-describedby': 'guess-help guess-message',
    }),
  );
  const cellsContainer = el(
    'div',
    {
      className: 'guess-cells',
      role: 'group',
      'aria-label': `Enter your ${length}-digit guess`,
      style: { gridTemplateColumns: `repeat(${length}, var(--guess-cell-size))` },
    },
    ...guessCells,
  );
  const guessHelp = el(
    'span',
    { id: 'guess-help', className: 'guess-help' },
    `${length} different digits`,
  );

  guessCells.forEach((cell, index) => {
    cell.addEventListener('input', () => {
      const value = cell.value.slice(-1);
      const duplicate = guessCells.some(
        (other, otherIndex) =>
          otherIndex !== index && other.value.toLowerCase() === value.toLowerCase(),
      );

      if (value && (!isValidDigit(value) || duplicate)) {
        cell.value = '';
        message.textContent = duplicate
          ? 'Each digit can only be used once.'
          : `Use digits valid for base ${base}.`;
        return;
      }

      cell.value = value;
      message.textContent = '';
      if (value && index < guessCells.length - 1) guessCells[index + 1]?.focus();
    });

    cell.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Backspace' && !cell.value && index > 0) {
        guessCells[index - 1]?.focus();
        return;
      }

      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault();
        guessCells[index - 1]?.focus();
      } else if (event.key === 'ArrowRight' && index < guessCells.length - 1) {
        event.preventDefault();
        guessCells[index + 1]?.focus();
      }
    });

    cell.addEventListener('paste', (event: ClipboardEvent) => {
      event.preventDefault();
      const pastedDigits = Array.from(event.clipboardData?.getData('text') ?? '');
      const occupied = new Set(
        guessCells
          .slice(0, index)
          .map((input) => input.value.toLowerCase())
          .filter(Boolean),
      );
      let nextIndex = index;
      guessCells.slice(index).forEach((input) => {
        input.value = '';
      });

      pastedDigits.forEach((digit) => {
        const normalizedDigit = digit.toLowerCase();
        if (
          nextIndex >= guessCells.length ||
          !isValidDigit(digit) ||
          occupied.has(normalizedDigit)
        ) {
          return;
        }

        const target = guessCells[nextIndex];
        if (!target) return;
        target.value = digit;
        occupied.add(normalizedDigit);
        nextIndex += 1;
      });

      message.textContent = '';
      guessCells[Math.min(nextIndex, guessCells.length - 1)]?.focus();
    });
  });

  const timer = el('output', { className: 'game-timer' });
  const guessButton = el(
    'button',
    {
      type: 'submit',
      className: 'button button--primary',
      disabled: state.status === 'won',
    },
    'Guess',
  );
  guessButton.prepend(createIcon(Send));
  const form = el(
    'form',
    {
      className: 'guess-form',
    },
    el('label', {}, 'Your guess'),
    cellsContainer,
    guessButton,
    guessHelp,
    message,
  );
  const historyList = el(
    'ol',
    { className: 'guess-history', 'aria-label': 'Submitted guesses' },
    ...[...state.history].reverse().map((attempt, index) => {
      const guessIndex = state.history.length - index;
      const bulls = el('span', { className: 'feedback-pill' }, `Bulls ${attempt.bulls}`);
      bulls.prepend(createIcon(Target));
      const cows = el(
        'span',
        { className: 'feedback-pill feedback-pill--cows' },
        `Cows ${attempt.cows}`,
      );
      cows.prepend(createIcon(Sparkles));

      return el(
        'li',
        {
          className: 'history-item',
        },
        el('span', { className: 'history-item__index' }, `#${guessIndex}`),
        el('span', { className: 'history-item__guess' }, attempt.guess.join('')),
        bulls,
        cows,
      );
    }),
  );
  const elapsed = state.startTime === null ? 0 : (state.endTime ?? Date.now()) - state.startTime;

  timer.textContent = formatDuration(elapsed);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const guess = guessCells.map((cell) => cell.value);
    if (!isValidGuess(guess, length, base)) {
      message.textContent = `Enter exactly ${length} unique digits valid for base ${base}.`;
      guessCells.find((cell) => !cell.value)?.focus();
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
      className: 'button button--secondary',
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
  newGameButton.prepend(createIcon(ArrowLeft));

  const heading = el(
    'h1',
    { className: 'screen-heading' },
    state.status === 'won' ? 'Code cracked!' : 'Crack the code',
  );
  heading.prepend(createIcon(state.status === 'won' ? Medal : Hash));

  const gameHeader = el(
    'header',
    { className: 'game-header' },
    el(
      'div',
      {},
      heading,
      el('p', { className: 'game-meta' }, `${length} unique digits · base ${base}`),
    ),
    newGameButton,
  );

  const timerIcon = el('span', { className: 'stat-card__icon' });
  timerIcon.append(createIcon(Clock3));
  const attemptsIcon = el('span', { className: 'stat-card__icon' });
  attemptsIcon.append(createIcon(Target));
  const stats = el(
    'div',
    { className: 'game-stats' },
    el(
      'div',
      { className: 'stat-card' },
      timerIcon,
      el(
        'div',
        {},
        el('span', { className: 'stat-card__label' }, 'Time'),
        el('span', { className: 'stat-card__value' }, timer),
      ),
    ),
    el(
      'div',
      { className: 'stat-card' },
      attemptsIcon,
      el(
        'div',
        {},
        el('span', { className: 'stat-card__label' }, 'Attempts'),
        el('span', { className: 'stat-card__value' }, state.attempts),
      ),
    ),
  );

  const historyTitle = el(
    'h2',
    { className: 'history-heading' },
    'Guess history',
    el(
      'span',
      { className: 'history-count' },
      `${state.history.length} ${state.history.length === 1 ? 'guess' : 'guesses'}`,
    ),
  );

  const historyEmpty = el('p', { className: 'history-empty' }, 'Your guesses will appear here.');
  historyEmpty.prepend(createIcon(History));
  const historyContent = state.history.length > 0 ? historyList : historyEmpty;

  const result =
    state.status === 'won'
      ? el(
          'p',
          { className: 'game-result' },
          `Solved in ${state.attempts} attempts and ${formatDuration(elapsed)}. Well played!`,
        )
      : el('div', { className: 'game-result-placeholder', 'aria-hidden': 'true' });

  if (state.status === 'won') {
    result.prepend(createIcon(Medal));
    const record = {
      length: state.settings.length,
      base: state.settings.base,
      attempts: state.attempts,
      time: elapsed,
      date: Date.now(),
    };
    const records: RecordStore[] | null = storage<RecordStore[]>('records')();
    if (!records) {
      storage<RecordStore[]>('records')([record]);
    } else {
      storage<RecordStore[]>('records')([...records, record]);
    }
  }

  root.append(
    el(
      'section',
      { className: `screen game-screen${state.status === 'won' ? ' game-screen--won' : ''}` },
      gameHeader,
      stats,
      result,
      form,
      el(
        'section',
        { className: 'history-panel', 'aria-label': 'Guess history' },
        historyTitle,
        historyContent,
      ),
      ...(state.status === 'won' ? [renderLeaderboard()] : []),
    ),
  );

  if (state.status === 'playing' && state.startTime !== null) {
    const startTime = state.startTime;
    timerInterval = window.setInterval(() => {
      timer.textContent = formatDuration(Date.now() - startTime);
    }, 1000);
  }
};
