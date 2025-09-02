import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function AccesoObservador() {
  const { token } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    ci: '',
    identificador: '',
    organizacion_politica: '',
  });

  const hasCalled = useRef(false);

  useEffect(() => {
    if (token && !hasCalled.current) {
      consultarAcceso(token);
      hasCalled.current = true;
    }
  }, [token]);

  const consultarAcceso = async (tokenParam) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registro-acceso/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenParam }),
      });

      const data = await res.json();

      if (data.res === false && data.status === 404) {
        setMostrarFormulario(true);
      } else if (data.res === true) {
        setDatos(data);
      } else {
        setError(data.msg || 'Error desconocido');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const registrarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/activarQr/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.res === true) {
        setDatos(data);
        setMostrarFormulario(false);
      } else {
        setError(data.msg || 'Error al registrar');
      }
    } catch (err) {
      setError('Error al enviar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const colorFondo = datos?.tipo === 'entrada' ? '#1AB394' : '#F8AC59';

  return (
    <Grid padding={2} minHeight="95vh" display="flex" justifyContent="center" alignItems="center">
      <Paper elevation={3} style={{ borderRadius: 15, padding: 20, maxWidth: 600, width: '100%' }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center" mb={2}>
            {error}
          </Typography>
        )}

        {mostrarFormulario && (
          <Box component="form" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" align="center">Registro de Observador</Typography>
            <TextField label="Nombre completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} fullWidth />
            <TextField label="CI" name="ci" value={formData.ci} onChange={handleChange} fullWidth />
            <TextField label="Identificador" name="identificador" value={formData.identificador} onChange={handleChange} fullWidth />
            <TextField label="Organización Política" name="organizacion_politica" value={formData.organizacion_politica} onChange={handleChange} fullWidth />
            <Button variant="contained" color="primary" onClick={registrarDatos}>Registrar</Button>
          </Box>
        )}

        {datos && (
          <Box textAlign="center">
            <Box
              marginBottom={2}
              backgroundColor={colorFondo}
              padding={2}
              borderRadius={3}
              color="#FFFFFF"
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                {datos.nombre_completo}
              </Typography>
              <Typography><strong>CI:</strong> {datos.ci}</Typography>
              <Typography><strong>Identificador:</strong> {datos.identificador}</Typography>
              <Typography><strong>Organización:</strong> {datos.organizacion_politica}</Typography>
              <Typography><strong>Tipo:</strong> {datos.tipo_credencial}</Typography>
            </Box>

            <Grid container justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1} backgroundColor={colorFondo} padding={1} borderRadius={2} color="#FFFFFF">
                <CalendarMonthIcon />
                <Typography>{new Date().toLocaleDateString()}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} backgroundColor={colorFondo} padding={1} borderRadius={2} color="#FFFFFF">
                <AccessAlarmsIcon />
                <Typography>{new Date().toLocaleTimeString()}</Typography>
              </Box>
            </Grid>
          </Box>
        )}
      </Paper>
    </Grid>
  );
}

export default AccesoObservador;
