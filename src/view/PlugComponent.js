import { AbstractComponent } from '../framework/view/abstract-component.js';
import { Status, StatusLabel } from '../const.js';

function createPlugTemplate(status) {
  return `
    <div class="task-list__empty">
      <p>Перетащите карточку</p>
    </div>
  `;
}

export default class PlugComponent extends AbstractComponent {
  #status = null;

  constructor({ status } = {}) {
    super();
    this.#status = status;
  }

  get template() {
    return createPlugTemplate(this.#status || '');
  }
}