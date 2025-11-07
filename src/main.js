
import HeaderComponent from './view/HeaderComponent.js';
import AddTaskFormComponent from './view/AddTaskFormComponent.js';
import TaskBoardPresenter from './presenter/tasks-board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import TasksModel from './model/task-model.js';
import TasksApiService from './tasks-api-service.js';

const END_POINT = 'https://6908f22e2d902d0651b23998.mockapi.io';


const headerContainer = document.querySelector('.header');
const addTaskFormContainer = document.querySelector('.add-task-section');
const taskBoardContainer = document.querySelector('.tasks-container');

const tasksModel = new TasksModel({
    tasksApiService: new TasksApiService(END_POINT)
});

const taskBoardPresenter = new TaskBoardPresenter({
  boardContainer: taskBoardContainer,
  tasksModel: tasksModel,
});

function handleNewTaskButtonClick() {
  taskBoardPresenter.createTask();
}

const formAddTaskComponent = new AddTaskFormComponent({
  onClick: handleNewTaskButtonClick,
});

render(new HeaderComponent(), headerContainer, RenderPosition.BEFOREEND);
render(formAddTaskComponent, addTaskFormContainer, RenderPosition.BEFOREEND);

formAddTaskComponent.attachEvents();

taskBoardPresenter.init();
