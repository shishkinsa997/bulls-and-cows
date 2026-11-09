import { describe, expect, it } from 'vitest';
import { addRecord, getTopRecords, RECORDS_LIMIT } from './records';
import type { RecordStore } from '../types/types';

const createRecord = (overrides: Partial<RecordStore> = {}): RecordStore => ({
  base: 10,
  length: 4,
  attempts: 5,
  time: 10000,
  date: 1,
  ...overrides,
});

describe('leaderboard records', () => {
  it('сортирует базовую таблицу лидеров по количеству попыток, а затем по времени', () => {
    const records = [
      createRecord({ attempts: 4, time: 12000 }),
      createRecord({ attempts: 3, time: 15000 }),
      createRecord({ attempts: 4, time: 9000 }),
      createRecord({ base: 8, attempts: 1, time: 1000 }),
    ];

    expect(getTopRecords(records, 10)).toEqual([records[1], records[2], records[0]]);
  });

  it('оставляет только первые N записей для соответствующей базы', () => {
    const records = Array.from({ length: RECORDS_LIMIT + 1 }, (_, index) =>
      createRecord({ attempts: index + 1 }),
    );

    expect(addRecord(records, createRecord({ attempts: 0 }))).toHaveLength(RECORDS_LIMIT);
    expect(addRecord(records, createRecord({ attempts: 0 }))[0]?.attempts).toBe(0);
  });

  it('ведет отдельные записи для других баз', () => {
    const binaryRecord = createRecord({ base: 2, attempts: 1 });
    const updated = addRecord([binaryRecord], createRecord({ attempts: 2 }));

    expect(updated).toContain(binaryRecord);
    expect(getTopRecords(updated, 2)).toEqual([binaryRecord]);
    expect(getTopRecords(updated, 10)).toHaveLength(1);
  });
});
