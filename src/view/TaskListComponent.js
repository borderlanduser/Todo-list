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
  const mouseY = event.clientY;
  
  if (tasks.length === 0) {
    return 0;
  }

  // Только позиции МЕЖДУ задачами (не в начале/конце)
  for (let i = 0; i < tasks.length - 1; i++) {
    const currentTask = tasks[i];
    const nextTask = tasks[i + 1];
    
    const currentTaskRect = currentTask.getBoundingClientRect();
    const nextTaskRect = nextTask.getBoundingClientRect();
    
    // Точка между задачами - середина расстояния между ними
    const betweenPoint = currentTaskRect.bottom + (nextTaskRect.top - currentTaskRect.bottom) / 2;
    
    if (mouseY < betweenPoint) {
      return i + 1; // Вставляем между currentTask и nextTask
    }
  }

  // Если не нашли позицию между, вставляем в конец
  return tasks.length;
}
}
