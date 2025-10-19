import { AbstractComponent } from '../framework/view/abstract-component.js';
function createHeaderComponentTemplate() {
  return `
    <div class="page-header">
      <h1>Список задач</h1>
    </div>
  `;
}

export default class HeaderComponent extends AbstractComponent{
  get template() {
    return createHeaderComponentTemplate();
  }
}
