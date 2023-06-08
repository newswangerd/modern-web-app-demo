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

interface IProps {
  completeTask: (task: ITaskType) => void;
  createTask: (name: string, taskList: ITaskListType) => void;
  deleteTask: (task: ITaskType) => void;
  taskList: ITaskListType;
  tasks: ITaskType[];
}

export const ListOfTasks = ({
  completeTask,
  createTask,
  deleteTask,
  taskList,
  tasks,
}: IProps) => {
  const [newTask, setNewTask] = React.useState<string>('');

  const handleCreateTask = (newTask, taskList) => {
    setNewTask('');
    createTask(newTask, taskList);
  };

  return (
    <List sx={{ width: '100%' }}>
      {tasks?.map((task) => {
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
            onClick={() => handleCreateTask(newTask, taskList)}
            edge='end'
            aria-label='create'
            disabled={newTask === ''}
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
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newTask !== '') {
              handleCreateTask(newTask, taskList);
            }
          }}
        />
      </ListItem>
    </List>
  );
};
