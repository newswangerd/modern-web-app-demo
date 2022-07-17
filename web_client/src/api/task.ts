import { BaseAPI } from './base';

export interface ITaskType {
  id: string;
  created: string;
  last_updated: string;
  name: string;
  description: string;
  is_complete: boolean;
  due_date: string;
  parent_task: string;
  list: string;
}

class _TaskAPI extends BaseAPI<ITaskType> {
  constructor() {
    super('tasks/', ['get', 'list', 'update', 'create', 'delete', 'patch']);
  }
}

export const TaskAPI = new _TaskAPI();
