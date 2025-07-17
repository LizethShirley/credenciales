import { useState, useRef, useEffect } from "react";
import { Grid, Typography, Stack, Box, Button } from "@mui/material";
import DateRangeFilter from "../atoms/DateRangerFilter";
import SideToggle from "../atoms/SideToggle";
import PrintPageWrapper from "../organisms/PrintPageWrapper";
import CredentialPages from "../organisms/CredenctialPageGroup"; // la importación nueva
import html2pdf from "html2pdf.js";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const CredentialPrintPageV1 = ({ fetchData }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [side, setSide] = useState("anverso");
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedRecinto, setSelectedRecinto] = useState("");

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        const opciones = data.map((c) => ({ id: c.id, nombre: c.nombre }));
        setCargos(opciones);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCargos();
  }, []);

  const printRef = useRef();

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `credenciales_${side}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleFiltrar = async () => {
    if (!dateRange.start || !dateRange.end) return alert("Selecciona fechas.");
    if (!selectedCargo) return alert("Selecciona un cargo.");
    if (
      selectedCargo.nombre === "NOTARIO ELECTORAL" &&
      !selectedRecinto
    )
      return alert("Selecciona una circunscripción.");

    const inicio = dateRange.start.toISOString().slice(0, 10);
    const fin = dateRange.end.toISOString().slice(0, 10);
    const cargo = selectedCargo.id;
    const circunscripcion =
      selectedCargo.nombre === "NOTARIO ELECTORAL" ? selectedRecinto : "";

    const result = await fetchData(inicio, fin, cargo, circunscripcion);
    if (result.res && Array.isArray(result.personal))
      setResultadosFiltrados(result.personal);
    else alert("No se encontraron resultados o hubo un error.");
  };

  const pages = chunkArray(resultadosFiltrados, 9);

  return (
    <Box sx={{ p: 5 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={2}
      >
        <DateRangeFilter
          startDate={dateRange.start}
          endDate={dateRange.end}
          onChange={setDateRange}
        />
        <PrintPageWrapper
          cargos={cargos}
          selectedCargo={selectedCargo}
          setSelectedCargo={setSelectedCargo}
          selectedRecinto={selectedRecinto}
          setSelectedRecinto={setSelectedRecinto}
        />
        <Button variant="outlined" onClick={handleFiltrar}>
          Filtrar
        </Button>
      </Stack>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <SideToggle side={side} onChange={setSide} />
        {resultadosFiltrados.length > 0 && (
          <Button variant="contained" onClick={handleDownloadPDF}>
            Descargar PDF
          </Button>
        )}
      </Grid>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={8}>
          {resultadosFiltrados.length > 0 ? (
            <Box ref={printRef}>
              <CredentialPages
                pages={pages}
                side={side}
              />
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

export default CredentialPrintPageV1;
