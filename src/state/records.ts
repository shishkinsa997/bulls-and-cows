import type { RecordStore } from '../types/types';

export const RECORDS_LIMIT = 10;

const compareRecords = (a: RecordStore, b: RecordStore): number =>
  a.attempts - b.attempts || a.time - b.time;

export const getTopRecords = (records: RecordStore[], base: RecordStore['base']): RecordStore[] =>
  records
    .filter((record) => record.base === base)
    .sort(compareRecords)
    .slice(0, RECORDS_LIMIT);

export const addRecord = (records: RecordStore[], record: RecordStore): RecordStore[] => [
  ...([2, 8, 10, 16] as const).flatMap((base) =>
    getTopRecords(
      [
        ...records.filter((existing) => existing.base === base),
        ...(base === record.base ? [record] : []),
      ],
      base,
    ),
  ),
];
