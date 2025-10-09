import { createElement } from '../framework/render.js';

function createTaskListComponentTemplate(status, title) {
  return `
    <div class="task-column ${status}-column">
      <h3>${title}</h3>
      <div class="tasks-list" data-status="${status}"></div>
    </div>
  `;
}

export default class TaskListComponent {
  constructor(status, title) {
    this.status = status;
    this.title = title;
    this.element = null;
  }

  getTemplate() {
    return createTaskListComponentTemplate(this.status, this.title);
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