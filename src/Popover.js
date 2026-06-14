/**
 * Popover — виджет всплывающей подсказки (Bootstrap-style).
 *
 * Рендерится в document.body с position: fixed.
 * Показывается СВЕРХУ кнопки-триггера и горизонтально
 * центрируется по ней. Позиционирование — в px (без translate/translate3d).
 *
 * Закрывается по клику вне popover'а и по нажатию Escape.
 *
 * Использование:
 *   const pop = new Popover(triggerElement, { title, content });
 *   pop.toggle();
 */
export default class Popover {
  /**
   * @param {HTMLElement} trigger - элемент, при клике на который показывается popover
   * @param {{ title: string, content: string }} options
   */
  constructor(trigger, { title = '', content = '' } = {}) {
    this.trigger = trigger;
    this.title = title;
    this.content = content;
    this.element = null;
    this._visible = false;

    // Биндим обработчики один раз, чтобы корректно снимать слушатели
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  /**
   * Создаёт DOM-элемент popover'а и добавляет его в document.body.
   * @returns {HTMLElement}
   */
  create() {
    const popover = document.createElement('div');
    popover.className = 'popover';
    popover.setAttribute('data-testid', 'popover');

    const header = document.createElement('div');
    header.className = 'popover__header';
    header.textContent = this.title;

    const body = document.createElement('div');
    body.className = 'popover__body';
    body.textContent = this.content;

    popover.append(header, body);

    // Вставляем в body — кнопка не может содержать блочные элементы (невалидный HTML)
    document.body.append(popover);
    this.element = popover;

    return popover;
  }

  /**
   * Рассчитывает позицию popover'а СВЕРХУ триггера через getBoundingClientRect().
   * Позиционирование в px, без translate/translate3d.
   * Координаты вьюпортные — работает с position: fixed без поправки на скролл.
   */
  _positionAbove() {
    if (!this.element) return;

    const triggerRect = this.trigger.getBoundingClientRect();

    const popoverWidth = this.element.offsetWidth || 276;
    const popoverHeight = this.element.offsetHeight || 80;

    // Горизонтальный центр триггера минус половина ширины popover'а
    const leftPx = triggerRect.left + (triggerRect.width - popoverWidth) / 2;

    // Сверху триггера: верхняя граница - высота popover'а - отступ для стрелки (12px)
    const topPx = triggerRect.top - popoverHeight - 12;

    this.element.style.left = `${leftPx}px`;
    this.element.style.top = `${topPx}px`;
  }

  /**
   * Показывает popover. Если ещё не создан — создаёт.
   */
  show() {
    if (!this.element) {
      this.create();
    }
    this.element.classList.add('popover--visible');
    // Считаем позицию, когда элемент уже видим и имеет реальные размеры
    this._positionAbove();
    this._visible = true;

    // Закрытие по клику вне и по Escape
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onKeyDown);
  }

  /**
   * Скрывает popover.
   */
  hide() {
    if (this.element) {
      this.element.classList.remove('popover--visible');
    }
    this._visible = false;

    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onKeyDown);
  }

  /**
   * Переключает видимость popover'а.
   */
  toggle() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Удаляет popover из DOM и сбрасывает состояние.
   */
  destroy() {
    this.hide();
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  /**
   * Закрывает popover при клике вне его и вне триггера.
   * @param {MouseEvent} event
   */
  _onDocumentClick(event) {
    const { target } = event;
    if (this.element && (this.element.contains(target) || this.trigger.contains(target))) {
      return;
    }
    this.hide();
  }

  /**
   * Закрывает popover по нажатию Escape.
   * @param {KeyboardEvent} event
   */
  _onKeyDown(event) {
    if (event.key === 'Escape') {
      this.hide();
    }
  }

  /**
   * @returns {boolean} виден ли popover в данный момент
   */
  get isVisible() {
    return this._visible;
  }
}
