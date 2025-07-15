import { useState, useEffect } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";

const CustomAutocomplete = ({ onChange }) => {
  const [valorSeleccionado, setValorSeleccionado] = useState(null); 
  const [recintosOpcions, setRecintosOpcions] = useState([]);
  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/recintos`);
        if (!resp.ok) throw new Error("Error al obtener secciones");
        const data = await resp.json();
        setRecintosOpcions(
          data.data.map((item) => ({ value: item.id, 
          localidad: item.nombreLocalidad, 
          municipio: item.nombreMunicipio, 
          provincia: item.nombreProvincia,  
          circunscripcion: item.circun, 
          colegio: item.nombreRecinto}))
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchCargos();
  }, []);

  return (
    <Autocomplete
  size="small"
  id="recinto-autocomplete"
  options={recintosOpcions}
  value={valorSeleccionado}
  onChange={(_, newValue) => {
        setValorSeleccionado(newValue);
        onChange && onChange(newValue); 
      }}
  getOptionLabel={(option) => option?.colegio || ""}
  isOptionEqualToValue={(option, value) => option.value === value?.value}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Seleccione un recinto electoral"
      placeholder="Seleccione un recinto electoral"
      variant="outlined"
      sx={{ fontSize: "8pt" }}
    />
  )}
  renderOption={(props, option, { selected }) => (
    <Box
      component="li"
      {...props}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.2,
        padding: 1,
        fontWeight: selected ? 700 : 400,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontSize: "9pt", fontWeight: "bold", textAlign: "center" }}
      >
        {option.colegio}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: "9pt" }}>
        <strong>Circunscripción:</strong> {option.circunscripcion},{" "}
        <strong>Provincia:</strong> {option.provincia},{" "}
        <strong>Municipio:</strong> {option.municipio},{" "}
        <strong>Localidad:</strong> {option.localidad}
      </Typography>
    </Box>
  )}
/>

  );
};

export default CustomAutocomplete;