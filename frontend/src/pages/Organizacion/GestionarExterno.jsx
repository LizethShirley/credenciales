import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import CustomSendIcon from '../../components/atoms/CustomSendIcon';

// Función para dividir un array en chunks de tamaño `size`
const chunkArray = (array, size = 9) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const GestionarExterno = () => {
  const [cargoSeleccionado, setCargoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');

  const handleChangeCargo = (event) => setCargoSeleccionado(event.target.value);
const accesosGenerados = useRef([]);

  const handleEnviar = async () => {
    if (!cantidad || !cargoSeleccionado) {
      return alert('Debe completar todos los campos');
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generar-accesos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          tipo: cargoSeleccionado,
          cantidad: Number(cantidad)
        })
      });

      if (!response.ok) throw new Error('Error al enviar los datos');

      const data = await response.json();

      if (!data.res || !Array.isArray(data.datos)) {
        alert("La API no devolvió un array válido");
        return;
      }

      // Guardamos los datos en la variable ref
      accesosGenerados.current = data.datos;

      // Llamamos al método que abre la ventana
      abrirPreview();

    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al enviar los datos');
    }
  };

  const abrirPreview = () => {
  if (!accesosGenerados.current.length) return alert("No hay datos para mostrar");

  // chunkArray para formar las páginas
  
};






  const handlePrevisualizar = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/acceso-externo/listar`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!resp.ok) throw new Error("Error al obtener datos");

      const data = await resp.json();
      const personsArray = Array.isArray(data) ? data : data.datos;

      if (!Array.isArray(personsArray)) {
        alert("La API no devolvió un array válido");
        return;
      }

      localStorage.setItem("credenciales_preview_pages", JSON.stringify(chunkArray(personsArray, 9)));
      localStorage.setItem("credenciales_preview_acceso", 0);
      localStorage.setItem("credenciales_preview_ids", JSON.stringify(personsArray.map(d => d.qr || d.barcode)));

      window.open("/preview", "_blank", "width=900,height=1400");
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos para previsualizar");
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 900 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Generar Credenciales
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Grid sx={{ display: 'grid', gap: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography sx={{ width: 350 }}>Cantidad de Credenciales:</Typography>
              <TextField
                fullWidth
                placeholder="Cantidad"
                variant="outlined"
                value={cantidad}
                onChange={e => setCantidad(e.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  <MenuItem value="delegado">Delegado</MenuItem>
                  <MenuItem value="publico">Público General</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Box sx={{ ml: 10 }}>
            <CustomSendIcon onClick={handleEnviar} />
            <Button
              variant="outlined"
              onClick={handlePrevisualizar}
              sx={{ ml: 2 }}
            >
              Previsualizar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GestionarExterno;
