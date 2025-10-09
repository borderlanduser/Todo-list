import { tasks } from '../mock/task.js';

export default class TaskModel {
  #boardTasks = tasks;

  getTasks() {
    return this.#boardTasks;
  }
}