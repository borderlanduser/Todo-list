import { createElement } from '../framework/render.js';

function createFormAddTaskComponentTemplate() {
  return `
    <div class="new-task-section">
      <h2>Новая задача</h2>
      <div class="new-task-bar">
        <input type="text" placeholder="Название задачи">
        <button class="add-btn">Добавить</button>
      </div>
    </div>
  `;
}

export default class AddTaskFormComponent {
  getTemplate() {
    return createFormAddTaskComponentTemplate();
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
