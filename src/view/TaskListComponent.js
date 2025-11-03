import { AbstractComponent } from '../framework/view/abstract-component.js';
function createTaskListComponentTemplate(className, label) {
  return `
    <section class="${className} task-column">
      <h3 class="task-header">${label}</h3>
    </section>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor({ status, label, onTaskDrop }) {
    super();
    this.status = status;
    this.label = label;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    
    return createTaskListComponentTemplate(this.status, this.label);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element;

    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      const dropPosition = this.#getDropPosition(event);
      onTaskDrop(taskId, this.status, dropPosition); 
    });
  }
  #getDropPosition(event) {
  const tasks = Array.from(this.element.querySelectorAll('.task'));
  const containerRect = this.element.getBoundingClientRect();
  const mouseY = event.clientY;
  
  if (tasks.length === 0) {
    return 0;
  }

  // Проверяем позицию ДО первой задачи
  const firstTask = tasks[0];
  const firstTaskRect = firstTask.getBoundingClientRect();
  if (mouseY < firstTaskRect.top - 10) { // +10px зона выше первой задачи
    return 0;
  }

  // Проверяем позиции МЕЖДУ задачами
  for (let i = 0; i < tasks.length - 1; i++) {
    const currentTask = tasks[i];
    const nextTask = tasks[i + 1];
    
    const currentTaskRect = currentTask.getBoundingClientRect();
    const nextTaskRect = nextTask.getBoundingClientRect();
    
    // Расширяем зону между задачами
    const dropZoneTop = currentTaskRect.bottom - 15;    // +15px над следующей задачей
    const dropZoneBottom = nextTaskRect.top + 15;       // +15px под предыдущей задачей
    
    if (mouseY >= dropZoneTop && mouseY <= dropZoneBottom) {
      return i + 1;
    }
  }

  // Проверяем позицию ПОСЛЕ последней задачи
  const lastTask = tasks[tasks.length - 1];
  const lastTaskRect = lastTask.getBoundingClientRect();
  if (mouseY > lastTaskRect.bottom + 10) { // +10px зона ниже последней задачи
    return tasks.length;
  }

  // Если не попали в расширенные зоны, используем старую логику
  for (let i = 0; i < tasks.length; i++) {
    const taskRect = tasks[i].getBoundingClientRect();
    if (mouseY < taskRect.top + taskRect.height / 2) {
      return i;
    }
  }
  
  return tasks.length;
}
}
