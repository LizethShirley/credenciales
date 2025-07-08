import React, { useState } from 'react';
import { TextField, Button, FormControl } from '@mui/material';
import { login } from '../../services/api';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await login({ email, password });
  };

  return (
    <FormControl fullWidth>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mt: 2 }} />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Entrar</Button>
    </FormControl>
  );
};

export default LoginForm;
