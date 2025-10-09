import TaskBoardComponent from "../view/TaskBoardComponent.js";
import TaskListComponent from '../view/TaskListComponent.js';
import TaskComponent from '../view/TaskComponent.js';
import ClearButtonComponent from '../view/ClearButtonComponent.js'; 
import { render } from '../framework/render.js';
import { Status, StatusLabel } from "../const.js";


export default class TaskBoardPresenter {
    taskListComponent = new TaskListComponent();

    #clearBtnComponent = new ClearButtonComponent();
    #boardContainer = null;
    #tasksModel = null;

    #tasksBoardComponent = new TaskBoardComponent();

    #boardTasks = [];

    constructor({ boardContainer, tasksModel}) {
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;
    }

    init() {
        this.#boardTasks = [...this.#tasksModel.getTasks()];

        render(this.#tasksBoardComponent, this.#boardContainer);
        Object.values(Status).forEach(element => {
        console.log('Creating column for status:', element);
        const tasksListComponent = new TaskListComponent(element, StatusLabel[element]);
        render(tasksListComponent, this.#tasksBoardComponent.getElement());

        const filteredTasks = this.#boardTasks.filter(task => task.status === element); 
        console.log(`Tasks for ${element}:`, filteredTasks);

        for (let j = 0; j < filteredTasks.length; j++) {
            const taskComponent = new TaskComponent({ task: filteredTasks[j] });
            const taskListElement = tasksListComponent.getElement().querySelector('.tasks-list');
            console.log('Rendering task to:', taskListElement);
            render(taskComponent, taskListElement);
        }

        if (element === Status.BASKET) {
            const clearBtnComponent = new ClearButtonComponent();
            render(clearBtnComponent, tasksListComponent.getElement());
        }
    });
    }
}