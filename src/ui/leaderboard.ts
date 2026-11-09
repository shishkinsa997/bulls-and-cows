import type { RecordStore } from '../types/types';
import storage from '../state/storage';
import { getTopRecords } from '../state/records';
import { el } from './dom';
import { createIcon } from './icons';
import { Medal } from 'lucide';

const BASE_LABELS: Record<RecordStore['base'], string> = {
  2: 'Binary',
  8: 'Octal',
  10: 'Decimal',
  16: 'Hexadecimal',
};

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}г`;
};

export const renderLeaderboard = (): HTMLElement => {
  const records = storage<RecordStore[]>('records')() ?? [];
  const title = el('h2', { className: 'leaderboard__title' }, 'Leaderboard');
  title.prepend(createIcon(Medal));

  const groups = ([2, 8, 10, 16] as const).map((base) => {
    const topRecords = getTopRecords(records, base);
    const rows =
      topRecords.length > 0
        ? topRecords.map((record, index) =>
            el(
              'tr',
              {},
              el('td', { className: 'leaderboard__rank' }, index + 1),
              el('td', {}, `${record.length} digits`),
              el('td', {}, record.attempts),
              el('td', {}, formatDuration(record.time)),
              el('td', {}, formatDate(record.date)),
            ),
          )
        : [
            el(
              'tr',
              {},
              el('td', { className: 'leaderboard__empty', colSpan: 5 }, 'No records yet.'),
            ),
          ];

    const group = el(
      'details',
      {
        className: 'leaderboard__group',
        ontoggle: (event: Event) => {
          const openedGroup = event.currentTarget as HTMLDetailsElement;
          if (!openedGroup.open) return;

          openedGroup
            .closest('.leaderboard')
            ?.querySelectorAll<HTMLDetailsElement>('.leaderboard__group[open]')
            .forEach((otherGroup) => {
              if (otherGroup !== openedGroup) otherGroup.open = false;
            });
        },
      },
      el(
        'summary',
        { className: 'leaderboard__base' },
        `${BASE_LABELS[base]} (base ${base})`,
        el('span', { className: 'leaderboard__count' }, topRecords.length),
      ),
      el(
        'div',
        { className: 'leaderboard__content' },
        el(
          'div',
          { className: 'leaderboard__table-scroll' },
          el(
            'table',
            { className: 'leaderboard__table' },
            el(
              'thead',
              {},
              el(
                'tr',
                {},
                el('th', { scope: 'col' }, '#'),
                el('th', { scope: 'col' }, 'Length'),
                el('th', { scope: 'col' }, 'Attempts'),
                el('th', { scope: 'col' }, 'Time'),
                el('th', { scope: 'col' }, 'Date'),
              ),
            ),
            el('tbody', {}, ...rows),
          ),
        ),
      ),
    );

    return group;
  });

  return el('section', { className: 'leaderboard', 'aria-label': 'Leaderboard' }, title, ...groups);
};
