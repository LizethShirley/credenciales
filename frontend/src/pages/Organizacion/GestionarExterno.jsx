import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  MenuList
} from '@mui/material';

import CustomSendIcon from '../../components/atoms/CustomSendIcon';

const GestionarExterno = () => {
  const [cargoSeleccionado, setCargoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');


  const handleChangeCargo = (event) => {
    setCargoSeleccionado(event.target.value);
  };

  const handleEnviar = async () => {
    if (!cantidad || !cargoSeleccionado) {
      alert('Debe completar todos los campos');
      return;
    }

    try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/generar-accesos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/json",
      },
      body: JSON.stringify({
        tipo: cargoSeleccionado,
        cantidad: Number(cantidad)
      })
    });

    console.log('Enviando datos:', cargoSeleccionado, cantidad);

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de validación:', data);
      throw new Error('Error al enviar los datos');
    }

    console.log('Respuesta:', data);
    alert('Datos enviados correctamente');

  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al enviar los datos');
  }
  };


  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Generar Credenciales
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Grid sx={{ display: 'grid', alignItems: 'center', gap: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', mb: 2 }}>
              <Typography sx={{ width: 350 }}>Cantidad de Credenciales:</Typography>
              <TextField
                fullWidth
                placeholder="Cantidad"
                variant="outlined"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography sx={{ minWidth: 218 }}>Cargo Externo:</Typography>
              <FormControl fullWidth>
                <InputLabel id="cargo-label">Cargo Externo</InputLabel>
                <Select
                  labelId="cargo-label"
                  value={cargoSeleccionado}
                  label="Cargo Externo"
                  onChange={handleChangeCargo}
                >
                  <MenuItem value="prensa">Prensa</MenuItem>
                  <MenuItem value="observador">Observador</MenuItem>
                  <MenuItem value="candidato">Candidato</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Box sx={{ml:10}}>
            <CustomSendIcon onClick={handleEnviar} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GestionarExterno;