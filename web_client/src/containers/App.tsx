import React from 'react';
import './App.css';
import { Container, Box, CircularProgress, Stack, Alert } from '@mui/material';

import { TaskList, Header, Login } from '../components';

import { TaskListAPI, TaskAPI, MeAPI, AuthAPI } from '../api';

import { ITaskListType, ITaskType, IUserType } from '../api';

interface IState {
  user: IUserType | null;
  taskLists: ITaskListType[] | null;
  tasks: { [key: string]: ITaskType[] } | null;
  view: 'loading' | 'tasks' | 'login';
  broke: boolean;
}

interface IProps {}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      user: null,
      taskLists: null,
      tasks: null,
      view: 'loading',
      broke: false,
    };
  }

  private loadTasks() {
    const promises = [TaskListAPI.list(), TaskAPI.list()];

    Promise.all(promises).then((results) => {
      const tasks: { [key: string]: ITaskType[] } = {};

      for (const task of results[1].data as ITaskType[]) {
        if (task.list in tasks) {
          tasks[task.list].push(task);
        } else {
          tasks[task.list] = [task];
        }
      }

      this.setState({
        view: 'tasks',
        taskLists: results[0].data,
        tasks: tasks,
        broke: false,
      });
    });
  }

  private load() {
    MeAPI.get()
      .then((result) => {
        this.setState({ user: result.data }, () => {
          this.loadTasks();
        });
      })
      .catch((err) => {
        this.setState({ view: 'login' });
      });
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { user, view, tasks, taskLists, broke } = this.state;
    let Component;

    if (view === 'tasks') {
      Component = this.taskView(tasks, taskLists);
    } else if (view === 'login') {
      Component = this.loginView();
    } else {
      Component = this.loadingView();
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Box>
          <Header
            logout={() =>
              AuthAPI.logout().then(() =>
                this.setState({
                  user: null,
                  taskLists: null,
                  tasks: null,
                  view: 'login',
                }),
              )
            }
            user={user}
          />
        </Box>
        <Container>
          <Box sx={{ my: 4 }}>
            {broke && (
              <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity='error'>
                  Something went wrong, but I'm too lazy to add validation on
                  anything, so try again I guess?
                </Alert>
              </Stack>
            )}

            {Component}
          </Box>
        </Container>
      </Box>
    );
  }

  loginView() {
    return (
      <Login
        login={(username, password) =>
          AuthAPI.login(username, password)
            .then(() => this.load())
            .catch((err) => this.setState({ broke: true }))
        }
        signUp={(username, password, email, first, last) =>
          AuthAPI.signUp({
            username: username,
            password: password,
            email: email,
            first_name: first,
            last_name: last,
          } as IUserType)
            .then(() => this.load())
            .catch((err) => this.setState({ broke: true }))
        }
      />
    );
  }

  taskView(tasks, taskLists) {
    return (
      <TaskList
        completeTask={(task) =>
          TaskAPI.patch(task.id, {
            is_complete: !task.is_complete,
          } as ITaskType).then((result) => this.loadTasks())
        }
        createTask={(name, taskList) =>
          TaskAPI.create({
            name: name,
            list: taskList.id,
          } as ITaskType).then((result) => this.loadTasks())
        }
        deleteTask={(task) =>
          TaskAPI.delete(task.id).then((result) => this.loadTasks())
        }
        createList={(name) =>
          TaskListAPI.create({
            name: name,
          } as ITaskListType).then((result) => this.loadTasks())
        }
        deleteList={(taskList) =>
          TaskListAPI.delete(taskList.id).then((result) => this.loadTasks())
        }
        tasks={tasks}
        taskLists={taskLists}
      />
    );
  }

  loadingView() {
    return <CircularProgress color='inherit' />;
  }
}

export default App;
