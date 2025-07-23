import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Button,
  Box,
  Typography,
} from "@mui/material";

const AutocompleteCi = ({ fetchData, setResultadosFiltrados }) => {
  const [opciones, setOpciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    obtenerPersonal();
  }, []);

  const obtenerPersonal = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal`);
      const data = await response.json();
      const ci = data.personal.map(item => item.ci);
      setOpciones(ci);
    } catch (error) {
      console.error("Error al obtener personal:", error);
    }
  };

  const handleBuscar = async () => {
    if (seleccionados.length === 0) return;

    const params = new URLSearchParams();
    seleccionados.forEach(ci => params.append('personal[]', ci));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/list/personal-filter?${params.toString()}`);
      const data = await res.json();
      if (data.res && Array.isArray(data.personal)) {
        setResultadosFiltrados(data.personal);
      } else {
        alert("No se encontraron resultados.");
      }
    } catch (error) {
      console.error("Error al buscar detalles:", error);
    }
  };

  return (
    <Box>
      <Autocomplete
        multiple
        options={opciones}
        value={seleccionados}
        onChange={(e, newValue) => setSeleccionados(newValue)}
        filterSelectedOptions
        renderTags={(value, getTagProps) =>
          value.map((numero, index) => (
            <Chip key={index} label={numero} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Selecciona CI" placeholder="Buscar..." />
        )}
      />

      <Button
        onClick={handleBuscar}
        variant="contained"
        sx={{ mt: 2 }}
        disabled={seleccionados.length === 0}
      >
        Buscar detalles
      </Button>
    </Box>
  );
};

export default AutocompleteCi;
