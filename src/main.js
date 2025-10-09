
import HeaderComponent from './view/HeaderComponent.js';
import AddTaskFormComponent from './view/AddTaskFormComponent.js';
import TaskBoardPresenter from './presenter/tasks-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import TaskModel from './model/task-model.js';


const headerContainer = document.querySelector('.header');
const addTaskFormContainer = document.querySelector('.add-task-section');
const taskBoardContainer = document.querySelector('.tasks-container');

const taskModel = new TaskModel();


const taskBoardPresenter = new TaskBoardPresenter({
    boardContainer: taskBoardContainer,
    tasksModel: taskModel,
});

render(new HeaderComponent(), headerContainer, RenderPosition.BEFOREEND);
render(new AddTaskFormComponent(), addTaskFormContainer, RenderPosition.BEFOREEND);

taskBoardPresenter.init();