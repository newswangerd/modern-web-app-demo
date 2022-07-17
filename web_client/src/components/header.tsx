import React from 'react';
import { Button, AppBar, Toolbar, IconButton, Typography } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';

import { IUserType } from '../api';

interface IProps {
  user: IUserType | null;

  logout: () => void;
}

export class Header extends React.Component<IProps> {
  render() {
    const { user, logout } = this.props;

    let title = 'To-Do App';

    if (user) {
      if (user.first_name) {
        title = `${user.first_name}'s to-do list`;
      } else {
        title = `${user.username}'s to-do list`;
      }
    }

    return (
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {user && (
            <Button color='inherit' onClick={() => logout()}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}
