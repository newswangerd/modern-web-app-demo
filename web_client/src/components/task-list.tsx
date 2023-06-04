import React from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  IconButton,
  TextField,
  Button,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ITaskListType, ITaskType } from '../api';

import { ListOfTasks } from '../components';

interface IState {
  newList: string;
}

interface IProps {
  taskLists: ITaskListType[];
  tasks: ITaskType[];

  completeTask: (task: ITaskType) => void;
  createTask: (name: string, taskList: ITaskListType) => void;
  deleteTask: (task: ITaskType) => void;

  createList: (name: string) => void;
  deleteList: (taskList: ITaskListType) => void;
}

export class TaskList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      newList: '',
    };
  }

  render() {
    const {
      taskLists,
      tasks,
      completeTask,
      createTask,
      deleteTask,
      deleteList,
    } = this.props;

    const { newList } = this.state;

    return (
      <>
        <List sx={{ width: '100%' }}>
          <ListItem
            secondaryAction={
              <IconButton
                onClick={() => this.createList(newList)}
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
              label='New list'
              variant='standard'
              value={newList}
              onChange={(e) => this.setState({ newList: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  this.createList(newList);
                }
              }}
            />
          </ListItem>
        </List>

        {taskLists.map((taskList) => (
          <Accordion key={taskList.id} defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography>{taskList.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ListOfTasks
                completeTask={(task) => completeTask(task)}
                createTask={(name, taskList) => createTask(name, taskList)}
                deleteTask={(task) => deleteTask(task)}
                tasks={tasks[taskList.id]}
                taskList={taskList}
              />
              <Button onClick={() => deleteList(taskList)} variant='text'>
                Delete List
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
  }

  private createList(newList) {
    this.setState({ newList: '' }, () => {
      this.props.createList(newList);
    });
  }
}
