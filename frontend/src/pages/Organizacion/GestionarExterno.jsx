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
  

  const handleChangeCargo = (event) => {
    setCargoSeleccionado(event.target.value);
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
                  <MenuItem value="observadores">Observadores</MenuItem>
                  <MenuItem value="delegados">Delegados</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Box sx={{ml:10}}>
            <CustomSendIcon onClick={() => console.log("Añadir")}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GestionarExterno;