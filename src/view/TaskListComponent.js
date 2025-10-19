import { AbstractComponent } from '../framework/view/abstract-component.js';
function createTaskListComponentTemplate(className, label) {
  return `
    <section class="${className} task-column">
      <h3 class="task-header">${label}</h3>
    </section>
  `;
}

export default class TaskListComponent extends AbstractComponent {
  constructor(className, label) {
    super();
    this.className = className;
    this.label = label;
  }

  get template() {
    return createTaskListComponentTemplate(this.className, this.label);
  }
}
