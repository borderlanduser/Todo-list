
import HeaderComponent from './view/HeaderComponent.js';
import AddTaskFormComponent from './view/AddTaskFormComponent.js';
import TaskBoardComponent from './view/TaskBoardComponent.js';
import TaskListComponent from './view/TaskListComponent.js';
import TaskComponent from './view/TaskComponent.js';
import { render, RenderPosition } from './framework/render.js';

const headerContainer = document.querySelector('.header');
const addTaskFormContainer = document.querySelector('.add-task-section');
const taskBoardContainer = document.querySelector('.container');

const taskBoardComponent = new TaskBoardComponent();

render(new HeaderComponent(), headerContainer, RenderPosition.BEFOREBEGIN);
render(new AddTaskFormComponent(), addTaskFormContainer, RenderPosition.BEFOREBEGIN);
render(taskBoardComponent, taskBoardContainer);

for (let j = 0; j < 4; j++) {
  const taskListComponent = new TaskListComponent();
  render(taskListComponent, taskBoardComponent.getElement());

  for (let i = 0; i < 4; i++) {
    render(new TaskComponent(), taskListComponent.getElement());
  }
}