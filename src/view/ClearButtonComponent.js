import { AbstractComponent } from '../framework/view/abstract-component.js';
function createClearButtonComponentTemplate() {
  return `
    <button class="clear-btn">
      <span class="cross">✖</span>
      <span class="clear-text">Очистить</span>
    </button>
  `;
}

export default class ClearButtonComponent extends AbstractComponent{
    get template() {
        return createClearButtonComponentTemplate();
    }
}
