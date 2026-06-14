import './styles.css';
import Popover from './Popover';

// Инициализируем popover для каждой кнопки с атрибутом data-popover-title
document.querySelectorAll('[data-popover-title]').forEach((trigger) => {
  const title = trigger.dataset.popoverTitle || '';
  const content = trigger.dataset.popoverContent || '';

  const popover = new Popover(trigger, { title, content });

  trigger.addEventListener('click', () => {
    popover.toggle();
  });
});
