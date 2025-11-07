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
    
    // ОСОБАЯ ЛОГИКА ДЛЯ КОРЗИНЫ - ВСЕГДА В КОНЕЦ
    if (this.status === 'basket') {
      return tasks.length; // Всегда добавляем в конец корзины
    }
    
    // Очищаем предыдущие индикаторы
    this.#clearDropZones();
    
    if (tasks.length === 0) {
      this.#showDropZone(this.element, 0, 'start');
      return 0;
    }

    let foundPosition = tasks.length;
    let hasFoundZone = false;

    // Зона перед первой задачей
    const firstTask = tasks[0];
    const firstTaskRect = firstTask.getBoundingClientRect();
    if (mouseY < firstTaskRect.top + 15) {
      this.#showDropZone(firstTask, 0, 'before');
      return 0;
    }

    // Зоны между задачами
    for (let i = 0; i < tasks.length - 1; i++) {
      const currentTask = tasks[i];
      const nextTask = tasks[i + 1];
      
      const currentTaskRect = currentTask.getBoundingClientRect();
      const nextTaskRect = nextTask.getBoundingClientRect();
      
      // Зона между задачами - от 10px после текущей до 10px до следующей
      const zoneTop = currentTaskRect.bottom + 5;
      const zoneBottom = nextTaskRect.top - 5;
      
      // Показываем зону всегда (для отладки)
      this.#showDropZone(nextTask, i + 1, 'between', zoneTop, zoneBottom);
      
      if (mouseY >= zoneTop && mouseY <= zoneBottom) {
        foundPosition = i + 1;
        hasFoundZone = true;
      }
    }

    // Зона после последней задачи
    const lastTask = tasks[tasks.length - 1];
    const lastTaskRect = lastTask.getBoundingClientRect();
    if (mouseY > lastTaskRect.bottom - 15) {
      this.#showDropZone(lastTask, tasks.length, 'after');
      return tasks.length;
    }

    if (hasFoundZone) {
      return foundPosition;
    }

    // Если не попали в зоны, вставляем в конец
    return tasks.length;
  }

  #clearDropZones() {
    const zones = this.element.querySelectorAll('.drop-zone');
    zones.forEach(zone => zone.remove());
  }

  #showDropZone(referenceElement, position, type, customTop = null, customBottom = null) {
    const zone = document.createElement('div');
    zone.className = `drop-zone ${type}`;
    zone.textContent = `→ ${position}`;
    zone.style.cssText = `
      height: 4px;
      background: #ff3366;
      margin: 3px 0;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    `;

    if (type === 'before') {
      referenceElement.parentNode.insertBefore(zone, referenceElement);
    } else if (type === 'after') {
      referenceElement.parentNode.insertBefore(zone, referenceElement.nextSibling);
    } else if (type === 'start') {
      this.element.insertBefore(zone, this.element.firstChild);
    } else if (type === 'between' && customTop && customBottom) {
      // Для визуализации зоны между задачами
      zone.style.height = (customBottom - customTop) + 'px';
      zone.style.background = 'rgba(255, 51, 102, 0.3)';
      zone.style.border = '1px dashed #ff3366';
      referenceElement.parentNode.insertBefore(zone, referenceElement);
    }
  }
}
