import { createElement } from 'lucide';

type LucideIconNode = Parameters<typeof createElement>[0];

export const createIcon = (icon: LucideIconNode, extraClass = ''): SVGElement =>
  createElement(icon, {
    class: ['icon', extraClass].filter(Boolean).join(' '),
    'aria-hidden': 'true',
    focusable: 'false',
  });
