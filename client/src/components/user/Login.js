import { Close, Send } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useValue } from '../../context/ContextProvider';
import PasswordField from './PasswordField';
import { useNavigate } from 'react-router-dom';
import { login as loginService, register as registerService } from '../../services/api';
import Swal from 'sweetalert2';

const Login = () => {
  const {
    state: { openLogin },
    dispatch,
  } = useValue();
  const [title, setTitle] = useState('Login');
  const [isRegister, setIsRegister] = useState(false);

  // Form references
  const usernameRef = useRef(null);
  const firstnameRef = useRef(null);
  const lastnameRef = useRef(null);
  const phoneRef = useRef(null);
  const sexeRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigate = useNavigate();

  const handleClose = () => {
    dispatch({ type: 'CLOSE_LOGIN' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect email and password
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!isRegister) {
      // Login mode
      dispatch({ type: 'START_LOADING' });

      try {
        const response = await loginService(email, password);
        const user = response.data;
        console.log('User logged in:', user);

        dispatch({ type: 'UPDATE_USER', payload: user });
        dispatch({ type: 'CLOSE_LOGIN' });
        dispatch({ type: 'END_LOADING' });

        if (user.role === 'ADMIN') {
          navigate('/dashboard/');
        }
      } catch (error) {
        dispatch({ type: 'CLOSE_LOGIN' });
        console.error('Login error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'An unknown error occurred. Please try again later.',
        });
        dispatch({ type: 'END_LOADING' });
      }

      return;
    }

    // Register mode
    const firstname = firstnameRef.current?.value;
    const lastname = lastnameRef.current?.value;
    const phone = phoneRef.current?.value;
    const sexe = sexeRef.current?.value;
    const role = 'USER';
    const confirmPassword = confirmPasswordRef.current?.value;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
      });
      return;
    }

    const newUser = { username: usernameRef.current?.value, firstname, lastname, role, phone, sexe, email, password };

    dispatch({ type: 'START_LOADING' });

    try {
      const response = await registerService(newUser);
      console.log('Registration successful:', response.data);
      dispatch({ type: 'CLOSE_LOGIN' });

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You can now log in with your credentials.',
      });

      setIsRegister(false);
    } catch (error) {
      dispatch({ type: 'CLOSE_LOGIN' });
      console.error('Registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'An unknown error occurred. Please try again later.',
      });
    } finally {
      dispatch({ type: 'END_LOADING' });
    }
  };

  useEffect(() => {
    isRegister ? setTitle('Register') : setTitle('Login');
  }, [isRegister]);

  return (
    <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogContent dividers>
          <DialogContentText>Please fill your information in the fields below:</DialogContentText>
          <Grid container spacing={1}>
            {isRegister && (
              <>
                <Grid item xs={12}>
                  <TextField
                    autoFocus
                    autoComplete="off"
                    margin="dense"
                    variant="standard"
                    id="username"
                    label="UserName"
                    type="text"
                    fullWidth
                    inputRef={usernameRef}
                    inputProps={{ minLength: 2 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    margin="dense"
                    variant="standard"
                    id="firstname"
                    label="First Name"
                    type="text"
                    fullWidth
                    inputRef={firstnameRef}
                    inputProps={{ minLength: 2 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    margin="dense"
                    variant="standard"
                    id="lastname"
                    label="Last Name"
                    type="text"
                    fullWidth
                    inputRef={lastnameRef}
                    inputProps={{ minLength: 2 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="off"
                    margin="dense"
                    variant="standard"
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    fullWidth
                    inputRef={phoneRef}
                    inputProps={{ minLength: 8 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    autoComplete="off"
                    margin="dense"
                    variant="standard"
                    id="sexe"
                    label="Gender"
                    fullWidth
                    SelectProps={{ native: true }}
                    inputRef={sexeRef}
                    required
                  >
                    <option value="" disabled>
                      Select your gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </TextField>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                autoComplete="off"
                margin="dense"
                variant="standard"
                id="email"
                label="Email"
                type="email"
                fullWidth
                inputRef={emailRef}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField passwordRef={passwordRef} />
            </Grid>
            {isRegister && (
              <Grid item xs={12}>
                <PasswordField
                  passwordRef={confirmPasswordRef}
                  id="confirmPassword"
                  label="Confirm Password"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: '19px' }}>
          <Button type="submit" variant="contained" fullWidth endIcon={<Send />}>
            Submit
          </Button>
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        {isRegister
          ? 'Do you have an account? Sign in now '
          : "Don't you have an account? Create one now "}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Login' : 'Register'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
