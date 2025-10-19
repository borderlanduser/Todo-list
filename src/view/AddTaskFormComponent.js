import { AbstractComponent } from '../framework/view/abstract-component.js';

export default class AddTaskFormComponent extends AbstractComponent {
  get template() {  
    return `
      <div class="new-task-section">
        <h2>Новая задача</h2>
        <div class="new-task-bar">
          <input type="text" placeholder="Название задачи">
          <button class="add-btn">Добавить</button>
        </div>
      </div>
    `;
  }
}