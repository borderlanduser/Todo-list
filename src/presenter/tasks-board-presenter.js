import TaskListComponent from '../view/TaskListComponent.js';
import TaskComponent from '../view/TaskComponent.js';
import TaskBoardComponent from '../view/TaskBoardComponent.js';
import { render } from '../framework/render.js';
import { Status, StatusLabel } from '../const.js';
import ClearButtonComponent from '../view/ClearButtonComponent.js';
import PlugComponent from '../view/PlugComponent.js';

export default class TaskBoardPresenter {
  #taskListComponent = new TaskListComponent();

    handleClearButtonClick = () => {
        this.clearBucket();
    };

    #clearBtnComponent = new ClearButtonComponent({
        onClick: this.handleClearButtonClick
    });


    #plugComponent = new PlugComponent();
    #boardContainer = null;
    #tasksModel = null;

    #tasksBoardComponent = new TaskBoardComponent();
    #boardTasks = [];

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this))
  }

  init() {
        this.#renderBoard()
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
      const filteredTasks = this.tasks.filter((task) => task.status === status);

      this.#renderPlugComponent(filteredTasks, tasksListComponent.element, status);

      for (const task of filteredTasks) {
        this.#renderTask(task, tasksListComponent.element);
      }

      this.#renderClearButton(status, tasksListComponent.element);
    });
  }
  createTask() {
    console.log('=== createTask called ===');
    
    const input = document.querySelector('.inputTask');
    console.log('Found input:', input);
    
    if (!input) {
        console.error('Input element with class .inputTask not found!');
        return;
    }
    
    const taskTitle = input.value.trim();
    console.log('Input value:', taskTitle);
    
    if (!taskTitle) {
        console.log('Empty task title');
        return;
    }
    
    console.log('Calling addTask with title:', taskTitle);
    this.#tasksModel.addTask(taskTitle);
    input.value = '';
    console.log('Task should be added');
}

    clearBucket() {
        this.#tasksModel.clearBucket();
    }

    #handleModelChange() {
        this.#clearBoard();
        this.#renderBoard();
    }

    #clearBoard() {
        this.#tasksBoardComponent.element.innerHTML = '';
    }

    get tasks() {
        return this.#tasksModel.tasks;
    }
}