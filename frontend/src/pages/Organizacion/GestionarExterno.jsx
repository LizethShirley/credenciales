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
} from '@mui/material';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
mock.onGet('/api/cargos').reply(200, [
  { id: 1, nombre: 'ADM II TÉCNICO UGLE' },
  { id: 2, nombre: 'ADMINISTRATIVO-CONTRATACIONES' },
  { id: 3, nombre: 'ADMINISTRATIVO POA-RRHH' },
  { id: 4, nombre: 'ADMINISTRATIVO FINANCIERO - POA-RRHH' },
  { id: 5, nombre: 'ADMINISTRATIVO DE CONTRATACIONES' },
  { id: 6, nombre: 'ADMINISTRATIVO CONTRATACIONES' },
  { id: 7, nombre: 'ADM III COORDINADOR ELECTORAL UGLE' },
  { id: 8, nombre: 'TÉCNICO DE MONITOREO A NOTARIOS' },
  { id: 9, nombre: 'TÉCNICO DE MONITOREO' },
  { id: 10, nombre: 'TÉCNICO ADMINISTRATIVO' },
  { id: 11, nombre: 'TÉCNICO - INSTALACIÓN DE CÁMARAS' },
  { id: 12, nombre: 'TÉCNICO - INFRAESTRUCTURA DE REDES' },
  { id: 13, nombre: 'APOYO ADMINISTRATIVO-CONTABILIDAD' },
]);

const GestionarExterno = () => {
  const [cargos, setCargos] = useState([]);
  const [cargoSeleccionado, setCargoSeleccionado] = useState('');
  useEffect(() => {
    const obtenerCargos = async () => {
      const { data } = await axios.get('/api/cargos');
      setCargos(data);
    };
    obtenerCargos();
  }, []);

  const handleChangeCargo = (event) => {
    setCargoSeleccionado(event.target.value);
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: -45, width: '240%'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Generar Credenciales
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography sx={{width: 250}}>Cantidad de Credenciales:</Typography>
          <TextField
            fullWidth
            placeholder="Cantidad"
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography sx={{ minWidth: 202 }}>Cargo Externo:</Typography>
          <FormControl fullWidth >
            <InputLabel id="cargo-label">Cargo Externo</InputLabel>
            <Select
              labelId="cargo-label"
              value={cargoSeleccionado}
              label="Cargo Externo"
              onChange={handleChangeCargo}
            >
              {cargos.map((cargo) => (
                <MenuItem key={cargo.id} value={cargo.nombre}>
                  {cargo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Grid>
  );
};

export default GestionarExterno;