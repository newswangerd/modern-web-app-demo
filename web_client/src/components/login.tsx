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
  Box,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IState {
  loginUser: string;
  loginPassword: string;

  newUser: string;
  newPassword: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface IProps {
  login: (username: string, password: string) => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    fisrtName: string,
    lastName: string,
  ) => void;
}

export class Login extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      loginPassword: '',

      newUser: '',
      newPassword: '',
      firstName: '',
      lastName: '',
      email: '',
    };
  }

  render() {
    const {
      loginUser,
      loginPassword,
      newUser,
      newPassword,
      firstName,
      lastName,
      email,
    } = this.state;

    const { login, signUp } = this.props;

    return (
      <div>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>Login</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component='form'
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                label='Username'
                value={loginUser}
                onChange={(e) => this.setState({ loginUser: e.target.value })}
              />
              <TextField
                label='Password'
                value={loginPassword}
                onChange={(e) =>
                  this.setState({ loginPassword: e.target.value })
                }
                type='password'
              />
            </Box>
            <Button onClick={() => login(loginUser, loginPassword)}>
              Login
            </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'
          >
            <Typography>Create an Account</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component='form'
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete='off'
            >
              <TextField
                label='Username'
                value={newUser}
                onChange={(e) => this.setState({ newUser: e.target.value })}
                required
              />
              <TextField
                label='Password'
                type='password'
                value={newPassword}
                onChange={(e) => this.setState({ newPassword: e.target.value })}
                required
              />
              <TextField
                label='Email'
                value={email}
                onChange={(e) => this.setState({ email: e.target.value })}
                required
              />
              <TextField
                label='First Name'
                value={firstName}
                onChange={(e) => this.setState({ firstName: e.target.value })}
              />
              <TextField
                label='Last Name'
                value={lastName}
                onChange={(e) => this.setState({ lastName: e.target.value })}
              />
            </Box>
            <Button
              onClick={() =>
                signUp(newUser, newPassword, email, firstName, lastName)
              }
            >
              Sign Up
            </Button>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
