import { createElement } from 'lucide';

type LucideIconNode = Parameters<typeof createElement>[0];

export const createIcon = (icon: LucideIconNode): SVGElement =>
  createElement(icon, {
    class: 'icon',
    'aria-hidden': 'true',
    focusable: 'false',
  });
