import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const {title, status, id} = task;
  
  return `
    <div class="task task--${status}" data-task-id="${id}">
      <span class="task__title">${title}</span>
      <button class="task__edit" type="button">✏️</button>
    </div>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #handleEditClick = null;
  
  constructor({ task, onEditClick }) {
    super();
    this.task = task;
    this.#handleEditClick = onEditClick;
    this.#afterCreateElement();
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  #afterCreateElement() {
    this.#makeTaskDraggable();
    this.#setEditButtonHandler();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', true);

    this.element.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', this.task.id);
    });
  }

  #setEditButtonHandler() {
    const editButton = this.element.querySelector('.task__edit');
    if (editButton && this.#handleEditClick) {
      editButton.addEventListener('click', this.#editClickHandler);
    }
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.#handleEditClick(this.task);
  }
}