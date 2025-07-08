import React from 'react';
import { Container, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm/LoginForm.jsx';

const Login = () => (
  <Container maxWidth="sm">
    <Typography variant="h4" gutterBottom>Iniciar sesión</Typography>
    <LoginForm />
  </Container>
);

export default Login;
