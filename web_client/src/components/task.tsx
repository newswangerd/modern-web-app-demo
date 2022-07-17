import React from 'react';
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
} from '@mui/material';

import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

import { ITaskType, ITaskListType } from '../api';

interface IState {
  newTask: string;
}

interface IProps {
  taskList: ITaskListType;
  tasks: ITaskType[];
  completeTask: (task: ITaskType) => void;
  createTask: (name: string, taskList: ITaskListType) => void;
  deleteTask: (task: ITaskType) => void;
}

export class ListOfTasks extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      newTask: '',
    };
  }

  render() {
    const { tasks, taskList, completeTask, deleteTask } = this.props;
    const { newTask } = this.state;

    return (
      <List sx={{ width: '100%' }}>
        {tasks &&
          tasks.map((task) => {
            const labelId = `checkbox-list-label-${task.id}`;

            return (
              <ListItem
                key={task.id}
                secondaryAction={
                  <IconButton
                    onClick={() => deleteTask(task)}
                    edge='end'
                    aria-label='delete'
                  >
                    <ClearIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={() => completeTask(task)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={task.is_complete}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={task.name} />
                </ListItemButton>
              </ListItem>
            );
          })}

        <ListItem
          secondaryAction={
            <IconButton
              onClick={() => this.createTask(newTask, taskList)}
              edge='end'
              aria-label='create'
            >
              <AddIcon />
            </IconButton>
          }
        >
          <TextField
            fullWidth
            size='small'
            label='New task'
            variant='standard'
            value={newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.createTask(newTask, taskList);
              }
            }}
          />
        </ListItem>
      </List>
    );
  }

  private createTask(newTask, taskList) {
    this.setState({ newTask: '' }, () => {
      this.props.createTask(newTask, taskList);
    });
  }
}
