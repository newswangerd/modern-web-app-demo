import { BaseAPI } from './base';

export interface ITaskListType {
  id: string;
  created: string;
  last_updated: string;
  name: string;
  description: string;
}

class _TaskListAPI extends BaseAPI<ITaskListType> {
  constructor() {
    super('task-lists/', [
      'get',
      'list',
      'update',
      'create',
      'delete',
      'patch',
    ]);
  }
}

export const TaskListAPI = new _TaskListAPI();
