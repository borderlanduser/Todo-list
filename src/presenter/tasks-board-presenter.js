import TaskListComponent from '../view/TaskListComponent.js';
import TaskComponent from '../view/TaskComponent.js';
import TaskBoardComponent from '../view/TaskBoardComponent.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import ClearButtonComponent from '../view/ClearButtonComponent.js';
import PlugComponent from '../view/PlugComponent.js';

export default class TaskBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TaskBoardComponent();
  #boardTasks = [];
  #clearButton = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  init() {
    this.#renderBoard();
  }

  #handleTaskDrop(taskId, newStatus, position) {
    this.#tasksModel.updateTaskStatus(taskId, newStatus, position);
  }

  #handleClearBin() {
    this.#tasksModel.clearBucket();
  }

  #updateClearButtonState() {
    if (this.#clearButton) {
      const hasBinTasks = this.tasks.some(task => task.status === Status.BASKET);
      this.#clearButton.element.disabled = !hasBinTasks;
    }
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderTasksList(status, container) {
    const tasksListComponent = new TaskListComponent({
      status: status,
      label: StatusLabel[status],
      onTaskDrop: this.#handleTaskDrop.bind(this)
    });
    
    render(tasksListComponent, container);
    return tasksListComponent;
  }

  #renderClearButton(container) {
    const hasBinTasks = this.tasks.some(task => task.status === Status.BASKET);
    
    this.#clearButton = new ClearButtonComponent({
      onClick: this.#handleClearBin.bind(this),
      disabled: !hasBinTasks
    });
    
    render(this.#clearButton, container);
  }

  #renderPlugComponent(container, status) {
    const plugComponent = new PlugComponent({ status: status });
    render(plugComponent, container);
  }

  #renderBoard() {
   
    this.#clearBoard();
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      const tasksListComponent = this.#renderTasksList(status, this.#tasksBoardComponent.element);
      const filteredTasks = this.tasks.filter((task) => task.status === status);

      
      const tasksContainer = tasksListComponent.element.querySelector('.tasks_list') || tasksListComponent.element;

      if (filteredTasks.length === 0) {
        this.#renderPlugComponent(tasksContainer, status);
      } else {
        filteredTasks.forEach((task) => {
          this.#renderTask(task, tasksContainer);
        });
      }

      
      if (status === Status.BASKET) {
        this.#renderClearButton(tasksListComponent.element);
      }
    });
  }

  createTask() {
    const input = document.querySelector('.inputTask');
    
    if (!input) {
      console.error('Input element with class .inputTask not found!');
      return;
    }
    
    const taskTitle = input.value.trim();
    
    if (!taskTitle) {
      return;
    }
    
    this.#tasksModel.addTask(taskTitle);
    input.value = '';
  }

  clearBucket() {
    this.#tasksModel.clearBucket();
  }

  #handleModelChange() {
    this.#renderBoard();
    this.#updateClearButtonState();
  }

  #clearBoard() {
    if (this.#tasksBoardComponent.element) {
      this.#tasksBoardComponent.element.innerHTML = '';
    }
  }

  get tasks() {
    return this.#tasksModel.tasks;
  }
}