import { useState } from "react";
import { Autocomplete, TextField, Box, Typography } from "@mui/material";

const opcionesExpedido = [
  { value: 1, localidad: "Cochabamba", municipio: "Tiquipaya", provincia: "Quillacollo", circunscripcion: "21", colegio:"UNIDAD EDUCATIVA LOS ANDES" },
  { value: 2, localidad: "Cochabamba", municipio: "Sacaba", provincia: "Chapare", circunscripcion: "22", colegio:"COLEGIO SAN FRANCISCO" },
  { value: 3, localidad: "Cochabamba", municipio: "Quillacollo", provincia: "Quillacollo", circunscripcion: "20", colegio:"ESCUELA MODELO" },
  { value: 4, localidad: "Cochabamba", municipio: "Colcapirhua", provincia: "Quillacollo", circunscripcion: "21", colegio:"COLEGIO NUEVO AMANECER" },
  { value: 5, localidad: "Cochabamba", municipio: "Punata", provincia: "Punata", circunscripcion: "23", colegio:"COLEGIO CENTRAL PUNATA" },
  { value: 6, localidad: "Cochabamba", municipio: "Vinto", provincia: "Quillacollo", circunscripcion: "20", colegio:"UNIDAD EDUCATIVA TUNARI" },
  { value: 7, localidad: "Cochabamba", municipio: "Sipe Sipe", provincia: "Quillacollo", circunscripcion: "22", colegio:"COLEGIO SAN MIGUEL" },
  { value: 8, localidad: "Cochabamba", municipio: "Tarata", provincia: "Esteban Arce", circunscripcion: "23", colegio:"ESCUELA NACIONAL TARATA" },
  { value: 9, localidad: "Cochabamba", municipio: "Villa Tunari", provincia: "Chapare", circunscripcion: "24", colegio:"COLEGIO AMAZÓNICO" },
  { value: 10, localidad: "Cochabamba", municipio: "Arani", provincia: "Arani", circunscripcion: "25", colegio:"UNIDAD EDUCATIVA ARANI" },
  { value: 11, localidad: "Cochabamba", municipio: "Totora", provincia: "Carrasco", circunscripcion: "24", colegio:"COLEGIO SAN LUIS" },
  { value: 12, localidad: "Cochabamba", municipio: "Mizque", provincia: "Mizque", circunscripcion: "26", colegio:"ESCUELA CENTRAL MIZQUE" },
  { value: 13, localidad: "Cochabamba", municipio: "Tiraque", provincia: "Tiraque", circunscripcion: "25", colegio:"COLEGIO TIQUIPAYA" },
  { value: 14, localidad: "Cochabamba", municipio: "Cliza", provincia: "Germán Jordán", circunscripcion: "26", colegio:"UNIDAD EDUCATIVA CLIZA" },
  { value: 15, localidad: "Cochabamba", municipio: "Entre Ríos", provincia: "Carrasco", circunscripcion: "24", colegio:"COLEGIO ENTRE RÍOS" }
];

const CustomAutocomplete = () => {
  const [valorSeleccionado, setValorSeleccionado] = useState(null); 

  return (
    <Autocomplete
      size="small"
      id="recinto-autocomplete"
      options={opcionesExpedido}
      value={valorSeleccionado}
      onChange={(_, newValue) => setValorSeleccionado(newValue)}
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