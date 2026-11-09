import type { Child, ElementAttributes } from '../types/types';
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: ElementAttributes = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;

    if (key === 'className') {
      element.className = String(value);
    } else if (key === 'textContent') {
      element.textContent = String(value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key in element) {
      (element as unknown as Record<string, unknown>)[key] = value;
    } else if (value === true) {
      element.setAttribute(key, '');
    } else {
      element.setAttribute(key, String(value));
    }
  });

  children.forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    element.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });

  return element;
}
