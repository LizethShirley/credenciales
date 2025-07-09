import React from 'react';
import { Container, Typography } from '@mui/material';
import LoginForm from '../../components/LoginForm/LoginForm';
import Layout from '../../Layout/Layout';

const Login = () => (
  <Layout>
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      <LoginForm />
    </Container>
  </Layout>
);

export default Login;
