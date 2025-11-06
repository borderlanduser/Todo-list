import Observable from '../framework/observable.js';
import { generateID } from '../utils.js';
import { UserAction, UpdateType } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardTasks = [];

  constructor({tasksApiService}) {
    super();
    this.#tasksApiService = tasksApiService;
  }

  get tasks() {
    return this.#boardTasks;
  }

  async init() {
  try {
    const tasks = await this.#tasksApiService.tasks;
    this.#boardTasks = tasks;
  } catch(err) {
    this.#boardTasks = [];
  }
  this._notify(UpdateType.INIT);
}

  getTasksByStatus(status) {
    return this.#boardTasks.filter(task => task.status === status);
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateID(),
    };

    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardTasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      
      this.#boardTasks.push(newTask);
      this._notify(UserAction.ADD_TASK, newTask);
      return newTask;
    }
  }

  async updateTask(taskId, newTitle) {
    const task = this.#boardTasks.find(task => task.id === taskId);
    if (task) {
      const previousTitle = task.title;
      task.title = newTitle;

      try {
        const updatedTask = await this.#tasksApiService.updateTask(task);
        Object.assign(task, updatedTask);
        this._notify(UserAction.UPDATE_TASK, task);
      } catch (err) {
        console.error('Ошибка при обновлении задачи на сервер:', err);
        task.title = previousTitle;
        throw err;
      }
    }
  }

  async updateTaskStatus(taskId, newStatus, position = null) {
    const taskIndex = this.#boardTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const task = this.#boardTasks[taskIndex];
    const previousStatus = task.status;

   
    this.#boardTasks.splice(taskIndex, 1);

    
    task.status = newStatus;
    
    
    if (position !== null && position >= 0 && position <= this.#boardTasks.length) {
      this.#boardTasks.splice(position, 0, task);
    } else {
      this.#boardTasks.push(task);
    }

    try {
      const updatedTask = await this.#tasksApiService.updateTask(task);
      Object.assign(task, updatedTask);
      this._notify(UserAction.UPDATE_TASK, task);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи на сервер:', err);
      
      this.#boardTasks = this.#boardTasks.filter(t => t.id !== taskId);
      task.status = previousStatus;
      this.#boardTasks.push(task);
      throw err;
    }
  }

  async deleteTask(taskId) {
    const taskIndex = this.#boardTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const deletedTask = this.#boardTasks[taskIndex];
    this.#boardTasks.splice(taskIndex, 1);

    try {
      await this.#tasksApiService.deleteTask(taskId);
      this._notify(UserAction.DELETE_TASK, { id: taskId });
    } catch (err) {
      console.error('Ошибка при удалении задачи на сервере:', err);
      
      this.#boardTasks.splice(taskIndex, 0, deletedTask);
      throw err;
    }
  }

  async clearBasketTasks() {
    const basketTasks = this.#boardTasks.filter(task => task.status === 'basket' || task.status === 'bin');
    
    if (basketTasks.length === 0) return;

    const originalTasks = [...this.#boardTasks];

    try {
      await Promise.all(basketTasks.map(task => this.#tasksApiService.deleteTask(task.id)));
      
      this.#boardTasks = this.#boardTasks.filter(task => 
        task.status !== 'basket' && task.status !== 'bin'
      );
      this._notify(UserAction.DELETE_TASK, { status: 'basket' });

    } catch (err) {
      console.error('Ошибка при удалении задач из корзины на сервере:', err);
   
      this.#boardTasks = originalTasks;
      throw err;
    }
  }

  hasBasketTasks() {
    return this.#boardTasks.some(task => 
      task.status === 'basket' || task.status === 'bin'
    );
  }

  
  clearBucket() {
    return this.clearBasketTasks();
  }
}