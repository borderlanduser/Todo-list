import { tasks } from "../mock/task.js";
import { generateID } from "../utils.js";

export default class TasksModel {
    #boardTasks = tasks;
    #observers = [];

    get tasks() {
        return this.#boardTasks;
    }

    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    addTask(title) {
        const newTask = {
            title,
            status: 'backlog',
            id: generateID(),
        };

        this.#boardTasks.push(newTask);
        this._notifyObservers();
        return newTask;
    }

    clearBucket() {
        this.#boardTasks = this.#boardTasks.filter(task => task.status !== 'basket');
        this._notifyObservers();
    }

    addObserver(observer) {
        this.#observers.push(observer);
    }

    removeObserver(observer) {
        this.#observers = this.#observers.filter((obs) => obs !== observer);
    }

    _notifyObservers() {
        this.#observers.forEach((observer) => observer())
    }
    updateTaskStatus(taskId, newStatus, position = null) {  
    const taskIndex = this.#boardTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const task = this.#boardTasks[taskIndex];

    this.#boardTasks.splice(taskIndex, 1);

    task.status = newStatus;
    
    if (position !== null) {
        this.#boardTasks.splice(position, 0, task);
    } else {
        this.#boardTasks.push(task);
    }
        this._notifyObservers();
  
}
}