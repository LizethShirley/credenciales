import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('token', data.token);
        window.location.href = '/Inicio';
      } else {
        setError(data.message || 'Error en las credenciales');
      }
    } catch (err) {
      setError('Error en la conexión con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      padding={1}
      margin={1}
      minHeight={'95vh'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={3}
        style={{
          borderRadius: '15px',
          backgroundColor: '#f9f9f9',
          width: '100%',
          maxWidth: 400,
          padding: '30px',
        }}
      >
        <Grid container spacing={0.5} flexDirection="row" justifyContent={'center'}  mb={2}>
          <img
            src={`/TEDLogo.jpg`}
            alt="Logo TED"
            style={{ width: '70px', height: '100%' }}
          />
          <Box backgroundColor="primary.main" width="1.5px"></Box>
          <img
            src={`/EleccionesLogo.png`}
            alt="Logo TED"
            style={{ width: '90px', height: '100%' }}
          />
        </Grid>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>

        <form onSubmit={handleLogin}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '&:hover': {
                  boxShadow: '4px 4px 8px #b0b0b0, -4px -4px 8px #ffffff',
                },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
                '&:hover': {
                  boxShadow: '4px 4px 8px #b0b0b0, -4px -4px 8px #ffffff',
                },
              }}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                boxShadow: '3px 3px 6px #c1c1c1, -3px -3px 6px #ffffff',
                '&:hover': {
                  boxShadow: '4px 4px 8px #b0b0b0, -4px -4px 8px #ffffff',
                },
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Box>

        </form>
      </Paper>
    </Grid>
  );
}

export default Login;
