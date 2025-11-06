import TaskListComponent from '../view/TaskListComponent.js';
import TaskComponent from '../view/TaskComponent.js';
import TaskBoardComponent from '../view/TaskBoardComponent.js';
import ClearButtonComponent from '../view/ClearButtonComponent.js';
import PlugComponent from '../view/PlugComponent.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel, UpdateType, UserAction } from '../const.js';
import LoadingViewComponent from '../view/LoadingViewComponent.js';
import TaskEditComponent from '../view/task-edit-component.js'; // Исправлен импорт

export default class TasksBoardPresenter {
  #taskBoardComponent = null;
  #loadingComponent = null;
  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];
  #clearButton = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    // ПОКАЗЫВАЕМ LOADING ПРИ СОЗДАНИИ
    this.#showLoading();

    this.#taskBoardComponent = new TaskBoardComponent();
    render(this.#taskBoardComponent, this.#boardContainer);

    this.#tasksModel.addObserver(this.#handleModelEvent.bind(this));
  }

  #showLoading() {
    this.#loadingComponent = new LoadingViewComponent();
    render(this.#loadingComponent, this.#boardContainer);
  }

  #hideLoading() {
    if (this.#loadingComponent) {
      this.#loadingComponent.element.remove();
      this.#loadingComponent = null;
    }
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }

  #handleModelEvent(event, payload) {
    console.log('Model event:', event);
    
    switch (event) {
      case UpdateType.INIT: // ДОБАВЛЕНО
        this.#hideLoading();
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#clearBoard();
        this.#renderBoard();
        this.#updateClearButtonState();
        break;
    }
  }

  #clearBoard() {
    while (this.#taskBoardComponent.element.firstChild) {
      this.#taskBoardComponent.element.removeChild(this.#taskBoardComponent.element.firstChild);
    }
  }

  async init() {
    await this.#tasksModel.init();
    // Loading скроется автоматически в handleModelEvent при UpdateType.INIT
  }

  #renderBoard() {
    this.#boardTasks = [...this.tasks];

    const lists = [
      { status: Status.BACKLOG, label: StatusLabel[Status.BACKLOG] },
      { status: Status.PROCESSING, label: StatusLabel[Status.PROCESSING] },
      { status: Status.DONE, label: StatusLabel[Status.DONE] },
      { status: Status.BASKET, label: StatusLabel[Status.BASKET] },
    ];

    for (const { status, label } of lists) {
      this.#renderTasksList(status, label);
    }
  }

  async createTask() {
    const input = document.querySelector('.inputTask');
    if (!input) {
      console.error('Input element with class .inputTask not found!');
      return;
    }
    
    const taskTitle = input.value.trim();
    if (!taskTitle) {
      return;
    }
    
    try {
      await this.#tasksModel.addTask(taskTitle);
      input.value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  async #handleTaskDrop(taskId, newStatus, position) { // Добавьте position в параметры
  try {
    await this.#tasksModel.updateTaskStatus(taskId, newStatus, position); // Передайте position
  } catch (err) {
    console.error('Ошибка при обновлении статуса задачи:', err);
  }
}

  async #handleClearBin() {
    try {
      await this.#tasksModel.clearBasketTasks();
    } catch (err) {
      console.error('Ошибка при очистке корзины:', err);
    }
  }

  #updateClearButtonState() {
    if (this.#clearButton) {
      // ИСПРАВЛЕНО НА Status.BASKET
      const hasBinTasks = this.tasks.some(task => task.status === Status.BASKET); 
      this.#clearButton.disabled = !hasBinTasks;
    }
  }

  #renderTasksList(status, label) {
  const listComponent = new TaskListComponent({
    status: status,
    label: label,
    onTaskDrop: this.#handleTaskDrop.bind(this)
  });
  
  render(listComponent, this.#taskBoardComponent.element);

  const tasks = this.tasks.filter((task) => task.status === status);

  // ИСПРАВЛЕННЫЙ ПОИСК КОНТЕЙНЕРА - используем сам элемент компонента
  const tasksContainer = listComponent.element;

  if (tasks.length === 0) {
    this.#renderPlug(tasksContainer, status); 
  } else {
    tasks.forEach((task) => {
      this.#renderTask(task, tasksContainer);
    });
  }

  if (status === Status.BASKET) {
    this.#renderClearButton(listComponent.element);
  }
}

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({
      task,
      onEditClick: this.#handleEditClick.bind(this) // ОСТАВЛЕНО редактирование
    });
    
    render(taskComponent, container);
  }

  // ОСТАВЛЕНО редактирование
  #handleEditClick = (task) => {
    console.log('Редактирование задачи:', task.id, task.title);
    this.#replaceTaskWithEditForm(task);
  }

  #replaceTaskWithEditForm(task) {
    const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
    if (!taskElement) return;
    const taskEditComponent = new TaskEditComponent({
      task,
      onFormSubmit: this.#handleEditFormSubmit.bind(this),
      onCancelClick: this.#handleEditCancel.bind(this)
    });
    taskElement.replaceWith(taskEditComponent.element);
  }

  #handleEditFormSubmit = async (taskId, newTitle) => {
    try {
      await this.#tasksModel.updateTask(taskId, newTitle);
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
    }
  }

  #handleEditCancel = () => {
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderClearButton(container) {
    // ИСПРАВЛЕНО НА Status.BASKET
    const hasBinTasks = this.tasks.some(task => task.status === Status.BASKET);
    
    const button = document.createElement('button');
    button.className = 'clear-btn';
    button.textContent = 'Очистить корзину';
    button.disabled = !hasBinTasks;
    
    button.addEventListener('click', () => this.#handleClearBin());
    
    container.appendChild(button);
    this.#clearButton = button; 
  }

  #renderPlug(container, status) { 
    const plugComponent = new PlugComponent({ status: status });
    render(plugComponent, container);
  }
}