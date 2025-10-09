import { createElement } from '../framework/render.js';

function createClearButtonComponentTemplate() {
  return `
    <button class="clear-btn">
      <span class="cross">✖</span>
      <span class="clear-text">Очистить</span>
    </button>
  `;
}

export default class ClearButtonComponent {
  getTemplate() {
    return createClearButtonComponentTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
