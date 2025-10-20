import { AbstractComponent } from '../framework/view/abstract-component.js';

function createAddTaskFormComponentTemplate() {
  return `
    <div class="new-task-section">
      <h2>Новая задача</h2>
      <div class="new-task-bar">
        <input type="text" placeholder="Название задачи" class="task-input inputTask">
        <button type="submit" class="add-btn">Добавить</button>
      </div>
    </div>
  `;
}

export default class AddTaskFormComponent extends AbstractComponent {
  #handleClick = null;

  constructor({ onClick } = {}) {
    super();
    this.#handleClick = onClick;
  }

  get template() {
    return createAddTaskFormComponentTemplate();
  }

  
  attachEvents() {
    const button = this.element.querySelector('.add-btn');
    if (button && typeof this.#handleClick === 'function') {
      button.addEventListener('click', (evt) => {
        evt.preventDefault();
        console.log('Add button clicked!');
        this.#handleClick();
      });
    }
  }
}
