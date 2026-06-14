/**
 * Тесты Popover на базе JSDOM (Jest)
 *
 * Popover рендерится в document.body (не внутри trigger),
 * позиционируется через getBoundingClientRect() в px.
 */

/* eslint-disable no-param-reassign, func-names */

import Popover from '../Popover';

// jsdom не рендерит layout, мокаем getBoundingClientRect и offsetWidth/Height
function mockTriggerRect(el, rect = {
  left: 100, top: 400, width: 150, height: 38,
}) {
  el.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
  });
  Object.defineProperty(el, 'offsetWidth', { get: () => rect.width, configurable: true });
  Object.defineProperty(el, 'offsetHeight', { get: () => rect.height, configurable: true });
}

function mockPopoverDimensions(pop, width = 276, height = 80) {
  Object.defineProperty(pop, 'offsetWidth', { get: () => width, configurable: true });
  Object.defineProperty(pop, 'offsetHeight', { get: () => height, configurable: true });
}

describe('Popover', () => {
  let trigger;

  beforeEach(() => {
    document.body.innerHTML = '';
    trigger = document.createElement('button');
    trigger.textContent = 'Click me';
    mockTriggerRect(trigger);
    document.body.append(trigger);
  });

  // ── 1. show() создаёт popover в document.body ───────────────────────────
  test('show() добавляет popover в document.body с классом popover--visible', () => {
    const pop = new Popover(trigger, { title: 'Test title', content: 'Test content' });
    pop.show();

    // popover должен быть в body, а НЕ внутри trigger
    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el).not.toBeNull();
    expect(el.classList.contains('popover--visible')).toBe(true);
    expect(trigger.querySelector('[data-testid="popover"]')).toBeNull();
  });

  // ── 2. hide() убирает класс popover--visible ────────────────────────────
  test('hide() убирает класс popover--visible', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    pop.hide();

    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el).not.toBeNull();
    expect(el.classList.contains('popover--visible')).toBe(false);
  });

  // ── 3. toggle() показывает ──────────────────────────────────────────────
  test('toggle() показывает popover, если он скрыт', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.toggle();

    expect(pop.isVisible).toBe(true);
    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el.classList.contains('popover--visible')).toBe(true);
  });

  // ── 4. toggle() скрывает ────────────────────────────────────────────────
  test('toggle() скрывает popover, если он уже виден', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    pop.toggle();

    expect(pop.isVisible).toBe(false);
    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el.classList.contains('popover--visible')).toBe(false);
  });

  // ── 5. destroy() ────────────────────────────────────────────────────────
  test('destroy() удаляет popover из DOM', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    pop.destroy();

    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el).toBeNull();
    expect(pop.isVisible).toBe(false);
  });

  // ── 6. Заголовок ────────────────────────────────────────────────────────
  test('отображает корректный заголовок в .popover__header', () => {
    const pop = new Popover(trigger, { title: 'Popover title', content: 'Some content' });
    pop.show();

    const header = document.body.querySelector('.popover__header');
    expect(header).not.toBeNull();
    expect(header.textContent).toBe('Popover title');
  });

  // ── 7. Контент ──────────────────────────────────────────────────────────
  test('отображает корректный контент в .popover__body', () => {
    const pop = new Popover(trigger, { title: 'T', content: "It's very engaging. Right?" });
    pop.show();

    const body = document.body.querySelector('.popover__body');
    expect(body).not.toBeNull();
    expect(body.textContent).toBe("It's very engaging. Right?");
  });

  // ── 8. Позиционирование в px через getBoundingClientRect ────────────────
  test('позиция left и top выставлена в px на основе getBoundingClientRect', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });

    // Мокаем размеры popover-элемента сразу после create()
    const origCreate = pop.create.bind(pop);
    pop.create = function () {
      const el = origCreate();
      mockPopoverDimensions(el, 276, 80);
      return el;
    };

    pop.show();

    const el = document.body.querySelector('[data-testid="popover"]');
    expect(el.style.left).toMatch(/^-?\d+(\.\d+)?px$/);
    expect(el.style.top).toMatch(/^-?\d+(\.\d+)?px$/);
  });

  // ── 9. Горизонтальное центрирование ─────────────────────────────────────
  test('left центрирует popover по горизонтали относительно триггера', () => {
    // triggerRect: left=100, width=150 → центр триггера = 175
    // popoverWidth=276 → leftPx = 100 + (150 - 276) / 2 = 100 - 63 = 37
    const pop = new Popover(trigger, { title: 'T', content: 'C' });

    const origCreate = pop.create.bind(pop);
    pop.create = function () {
      const el = origCreate();
      mockPopoverDimensions(el, 276, 80);
      return el;
    };

    pop.show();

    const el = document.body.querySelector('[data-testid="popover"]');
    const expectedLeft = 100 + (150 - 276) / 2; // = 37
    expect(el.style.left).toBe(`${expectedLeft}px`);
  });

  // ── 10. isVisible геттер ────────────────────────────────────────────────
  test('isVisible возвращает false до show()', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    expect(pop.isVisible).toBe(false);
  });

  test('isVisible возвращает true после show()', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    expect(pop.isVisible).toBe(true);
  });

  // ── 11. Повторный show() не дублирует popover ───────────────────────────
  test('повторный вызов show() не создаёт второй popover', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    pop.show();

    const popovers = document.body.querySelectorAll('[data-testid="popover"]');
    expect(popovers.length).toBe(1);
  });

  // ── 12. Клик вне popover'а закрывает его ────────────────────────────────
  test('клик вне popover и вне триггера скрывает popover', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    expect(pop.isVisible).toBe(true);

    const outside = document.createElement('div');
    document.body.append(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(pop.isVisible).toBe(false);
  });

  // ── 13. Клик по самому popover'у не закрывает его ───────────────────────
  test('клик внутри popover не скрывает его', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();

    const header = document.body.querySelector('.popover__header');
    header.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(pop.isVisible).toBe(true);
  });

  // ── 14. Escape закрывает popover ────────────────────────────────────────
  test('нажатие Escape скрывает popover', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    expect(pop.isVisible).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(pop.isVisible).toBe(false);
  });

  // ── 15. destroy() снимает глобальные слушатели ──────────────────────────
  test('после destroy() Escape не падает и popover остаётся скрытым', () => {
    const pop = new Popover(trigger, { title: 'T', content: 'C' });
    pop.show();
    pop.destroy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(pop.isVisible).toBe(false);
    expect(document.body.querySelector('[data-testid="popover"]')).toBeNull();
  });
});
