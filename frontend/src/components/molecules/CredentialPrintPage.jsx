import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";
import { useReactToPrint } from "react-to-print";

import CustomCredencial from "../organisms/CustomCredencial";

/** Divide array en grupos de 9 para hojas A4 */
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/** Filtro de fechas */
const DateRangeFilter = ({ startDate, endDate, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
      <DatePicker
        label="Fecha inicio"
        value={startDate}
        onChange={(newVal) => onChange({ start: newVal, end: endDate })}
        slotProps={{ textField: { size: "small" } }}
      />
      <DatePicker
        label="Fecha fin"
        value={endDate}
        onChange={(newVal) => onChange({ start: startDate, end: newVal })}
        slotProps={{ textField: { size: "small" } }}
      />
    </Stack>
  </LocalizationProvider>
);

/** Selector de lado */
const SideToggle = ({ side, onChange }) => (
  <ToggleButtonGroup
    color="primary"
    value={side}
    exclusive
    onChange={(_, val) => val && onChange(val)}
    size="small"
  >
    <ToggleButton value="anverso">Anverso</ToggleButton>
    <ToggleButton value="reverso">Reverso</ToggleButton>
  </ToggleButtonGroup>
);

/** Página A4 para imprimir */
const A4Page = ({ children }) => (
  <Box
    className="print-page"
    sx={{
      width: "21.59cm",
      height: "27.94cm",
      p: "1cm",
      boxSizing: "border-box",
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5cm",
      backgroundColor: "#fff",
    }}
  >
    {children}
  </Box>
);

/** Contenedor de credenciales por página */
const CredentialSheet = ({ persons, side }) => (
  <A4Page>
    {persons.map((p) => (
      <CustomCredencial key={`${p.id}-${side}`} persona={p} lado={side} />
    ))}
  </A4Page>
);

const CredentialPrintPage = ({ data = [], fetchData }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [side, setSide] = useState("anverso");
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `credenciales_${side}_${Date.now()}`,
  });

  const handleFiltrar = async () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Por favor selecciona una fecha de inicio y fin.");
      return;
    }

    const inicio = dateRange.start.toISOString().slice(0, 10);
    const fin = dateRange.end.toISOString().slice(0, 10);

    await fetchData(inicio, fin); // Llama a la función del componente padre
    setResultadosFiltrados(data); // Actualiza con los datos ya filtrados por la API
  };

  const pages = chunkArray(resultadosFiltrados, 9);

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <DateRangeFilter
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
        />
        <SideToggle side={side} onChange={setSide} />
        <Button variant="outlined" onClick={handleFiltrar}>
          Filtrar
        </Button>
        {resultadosFiltrados.length > 0 && (
          <Button variant="contained" onClick={handlePrint}>
            Imprimir
          </Button>
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {resultadosFiltrados.length > 0 ? (
            <Box ref={printRef}>
              {pages.map((grupo, idx) => (
                <CredentialSheet key={idx} persons={grupo} side={side} />
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {dateRange.start && dateRange.end
                ? "No se encontraron credenciales en ese rango."
                : "Selecciona un rango de fechas y presiona Filtrar."}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CredentialPrintPage;
