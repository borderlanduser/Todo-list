import TaskListComponent from '../view/TaskListComponent.js';
import TaskComponent from '../view/TaskComponent.js';
import TaskBoardComponent from '../view/TaskBoardComponent.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import ClearButtonComponent from '../view/ClearButtonComponent.js';
import PlugComponent from '../view/PlugComponent.js';

export default class TaskBoardPresenter {
  #tasksBoardComponent = new TaskBoardComponent();
  #clearBtnComponent = new ClearButtonComponent();
  #boardContainer = null;
  #tasksModel = null;
  #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];
    this.#renderBoard();
  }

  #renderTask(task, container) {
    const taskComponent = new TaskComponent({ task });
    render(taskComponent, container);
  }

  #renderTasksList(status, container) {
    const tasksListComponent = new TaskListComponent(status, StatusLabel[status]);
    render(tasksListComponent, container);
    return tasksListComponent;
  }

  #renderClearButton(status, container) {
    if (status === Status.BASKET) {
      render(this.#clearBtnComponent, container);
    }
  }

  #renderPlugComponent(tasks, container, status) {
  if (tasks.length === 0) {
    const plugComponent = new PlugComponent({ status: status });
    render(plugComponent, container);
  }
}

  #renderBoard() {
    render(this.#tasksBoardComponent, this.#boardContainer);

    Object.values(Status).forEach((status) => {
      const tasksListComponent = this.#renderTasksList(status, this.#tasksBoardComponent.element);
      const filteredTasks = this.#boardTasks.filter((task) => task.status === status);

      this.#renderPlugComponent(filteredTasks, tasksListComponent.element, status);

      for (const task of filteredTasks) {
        this.#renderTask(task, tasksListComponent.element);
      }

      this.#renderClearButton(status, tasksListComponent.element);
    });
  }
}