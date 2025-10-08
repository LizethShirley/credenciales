// src/components/FormularioObservador.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

function FormularioObservador({ onSubmit, loading, tipo }) {
  const [formData, setFormData] = useState({
    nombre_completo: '',
    ci: '',
    identificador: '',
    organizacion_politica: '',
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); 
  };
  console.log("tipo:", tipo);
  return (
    <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
      <Typography variant="h6" align="center">Registro de Observador</Typography>

      <TextField
        label="Nombre completo"
        name="nombre_completo"
        value={formData.nombre_completo}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="CI"
        name="ci"
        value={formData.ci}
        onChange={handleChange}
        fullWidth
      /> 
      {tipo === "delegado" || tipo === "candidato" || tipo === "observador"? (
        <TextField
          label="Organización Política"
          name="organizacion_politica"
          value={formData.organizacion_politica}
          onChange={handleChange}
          fullWidth
        />
      ) : tipo === "prensa" ? (
        <TextField
          label="Identificador"
          name="identificador"
          value={formData.identificador}
          onChange={handleChange}
          fullWidth
        />
      ) : null}
    
      <Button variant="outlined" component="label">
        Subir Foto
        <input
          type="file"
          name="foto"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </Button>

      {formData.foto && (
        <Typography variant="body2" color="text.secondary">
          Archivo seleccionado: {formData.foto.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </Button>
    </Box>
  );
}

export default FormularioObservador;
