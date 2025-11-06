import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskEditTemplate(task) {
  return `
    <div class="task-edit" data-task-id="${task.id}">
      <form class="task-edit-form">
        <input type="text" value="${task.title}" class="task-edit-input">
        <div class="task-edit-buttons">
          <button type="submit" class="task-edit-save">Сохранить</button>
          <button type="button" class="task-edit-cancel">Отмена</button>
        </div>
      </form>
    </div>
  `;
}

export default class TaskEditComponent extends AbstractComponent {
  #onFormSubmit = null;
  #onCancelClick = null;

  constructor({ task, onFormSubmit, onCancelClick }) {
    super();
    this.task = task;
    this.#onFormSubmit = onFormSubmit;
    this.#onCancelClick = onCancelClick;

    this.#setEventListeners();
  }

  get template() {
    return createTaskEditTemplate(this.task);
  }

  #setEventListeners() {
    const form = this.element.querySelector('.task-edit-form');
    const cancelButton = this.element.querySelector('.task-edit-cancel');

    form.addEventListener('submit', this.#formSubmitHandler);
    cancelButton.addEventListener('click', this.#cancelClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const input = this.element.querySelector('.task-edit-input');
    const newTitle = input.value.trim();
    
    if (newTitle && this.#onFormSubmit) {
      this.#onFormSubmit(this.task.id, newTitle);
    }
  }

  #cancelClickHandler = () => {
    if (this.#onCancelClick) {
      this.#onCancelClick();
    }
  }
}