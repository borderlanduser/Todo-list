import { createElement } from '../framework/render.js';

function createTaskListComponentTemplate() {
  return `
    <div class="task-column backlog-column">
      <h3>Бэклог</h3>
      <div class="tasks-list"></div>
    </div>
  `;
}

export default class TaskListComponent {
  getTemplate() {
    return createTaskListComponentTemplate();
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
