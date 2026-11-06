# Bulls and Cows

Игра «Быки и коровы» на TypeScript: угадай секретное число из уникальных цифр. После каждой попытки — подсказка `bulls` / `cows`.

## Стек

TypeScript, Vite, Vitest, Tailwind CSS, SCSS, Lucide, ESLint, Prettier, Husky.

## Скрипты

```bash
npm run dev       # дев-сервер
npm run build     # сборка
npm test          # тесты
npm run lint      # линтер
npm run format    # форматирование
```

## Разработка

```bash
npm install
npm run dev
```

## Архитектура

Игровая логика — чистые функции без классов и DOM (`generateSecret`, `evaluateGuess`, `isValidGuess`, `createDigitValidator`, `countPossibleSecrets`). Состояние обновляется иммутабельно.
