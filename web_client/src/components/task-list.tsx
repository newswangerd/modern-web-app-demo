import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ITaskListType, ITaskType } from '../api';

import { ListOfTasks } from '../components';


interface IProps {
  completeTask: (task: ITaskType) => void;
  createList: (name: string) => void;
  createTask: (name: string, taskList: ITaskListType) => void;
  deleteList: (taskList: ITaskListType) => void;
  deleteTask: (task: ITaskType) => void;
  taskLists: ITaskListType[];
  tasks: ITaskType[];
}

export const TaskList: React.FC<IProps> =({
      completeTask,
      createList,
      createTask,
      deleteList,
      deleteTask,
      taskLists,
      tasks,
}) => {

  const [newList, setNewList] = React.useState('')

  const handleCreateList = () => { 
    createList(newList);
    setNewList('');    
  }

    return (
      <>
        <List sx={{ width: '100%' }}>
          <ListItem
            secondaryAction={
              <IconButton
                onClick={() => handleCreateList()}
                edge='end'
                aria-label='create'
                disabled={newList === ''}
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
              onChange={(e) => setNewList(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newList !== '') {
                  handleCreateList();
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



