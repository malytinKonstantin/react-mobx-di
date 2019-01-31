import { Service, Inject } from 'typedi';
import { plainToClass, classToClass } from 'class-transformer';
import { DataStorage } from '../storage/DataStorage';
import * as fetch from 'isomorphic-fetch';
import { action } from 'mobx';
import { TodoModel } from '../models/TodoModel';
const responseMock = {
  items: [
    {
      id: 1,
      isCompleted: false,
      text: 'Item 1'
    },
    {
      id: 2,
      isCompleted: true,
      text: 'Item 2'
    }
  ]
};
@Service('TodoService')
export class TodoService {
  @Inject('DataStorage')
  public dataStorage: DataStorage;

  @action
  public load = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.dataStorage.todos = plainToClass(TodoModel, responseMock.items);
  };

  @action
  public save(todo: TodoModel): void {
    if (todo.id) {
      const idx = this.dataStorage.todos.findIndex(item => todo.id === item.id);
      this.dataStorage.todos[idx] = classToClass(todo);
    } else {
      const todos = this.dataStorage.todos.slice();
      todo.id = Math.floor(Math.random() * Math.floor(100000));
      todos.push(todo);
      this.dataStorage.todos = todos;
    }
    this.clearTodo();
  }

  @action
  public edit(todo: TodoModel): void {
    this.dataStorage.todo = classToClass(todo);
  }

  @action
  public clearTodo(): void {
    this.dataStorage.todo = new TodoModel();
  }
}