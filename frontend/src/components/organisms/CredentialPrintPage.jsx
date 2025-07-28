import { useState, useRef, useEffect } from "react";
import { Grid, Typography, Stack, Box, Button, Snackbar, Alert, Switch, FormControlLabel } from "@mui/material";
import DateRangeFilter from "../atoms/DateRangerFilter";
import SideToggle from "../atoms/SideToggle";
import PrintPageWrapper from "../organisms/PrintPageWrapper";
import CredentialPages from "../organisms/CredentialPageGroup";
import html2pdf from "html2pdf.js";
import CircularProgress from '@mui/material/CircularProgress';
import AutocompleteCi from "../molecules/AutocompleteCi";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const CredentialPrintPage = ({ fetchData }) => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [side, setSide] = useState("anverso");
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedRecinto, setSelectedRecinto] = useState("");
  const [loading, setLoading] = useState(false);
  const printRef = useRef();
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [accesoComputo, setAccesoComputo] = useState(0);

  const handleToggleAcceso = async (e) => {
  const nuevoValor = e.target.checked ? 1 : 0;
  setAccesoComputo(nuevoValor);

  // Solo filtrar si ya se eligieron fechas y un cargo
  if (dateRange.start && dateRange.end && selectedCargo) {
    await handleFiltrar(nuevoValor);
  } else {
    showAlert("Selecciona fechas y cargo para aplicar el filtro.", "warning");
  }
};



  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        setCargos(data);
      } catch (error) {
        console.error(error);
        showAlert("Error al obtener cargos", "error");
      }
    };
    fetchCargos();
  }, []);

  const handleFiltrar = async (accesoValue = accesoComputo) => {
    setLoading(true);

    if (!dateRange.start || !dateRange.end) {
      showAlert("Selecciona fechas.", "warning");
      setLoading(false);
      return;
    }
    if (!selectedCargo) {
      showAlert("Selecciona un cargo.", "warning");
      setLoading(false);
      return;
    }
    if (
      selectedCargo.nombre === "NOTARIO ELECTORAL" &&
      !selectedRecinto
    ) {
      showAlert("Selecciona una circunscripción.", "warning");
      setLoading(false);
      return;
    }

    const inicio = dateRange.start.toISOString().slice(0, 10);
    const fin = dateRange.end.toISOString().slice(0, 10);
    const cargo = selectedCargo.id;
    const circunscripcion =
      selectedCargo.nombre === "NOTARIO ELECTORAL" ? selectedRecinto : "";

    try {
      const result = await fetchData(inicio, fin, cargo, circunscripcion, accesoValue);
      await new Promise((res) => setTimeout(res, 2000));
      if (result.res && Array.isArray(result.personal)) {
        setResultadosFiltrados(result.personal);
        if (result.personal.length === 0) {
          showAlert("No se encontraron resultados.", "info");
        } else {
          showAlert("Resultados filtrados correctamente.", "success");
        }
      } else {
        showAlert("No se encontraron resultados o hubo un error.", "error");
      }
    } catch (error) {
      console.error(error);
      showAlert("Error al filtrar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };


  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const options = {
      margin: 0,
      filename: `credenciales_${side}_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(options).from(element).toPdf().save();
  };

  const handleOpenWindow = () => {
    localStorage.setItem('credenciales_preview_pages', JSON.stringify(pages));
    localStorage.setItem('credenciales_preview_side', side);
    localStorage.setItem('credenciales_preview_acceso', accesoComputo);
    window.open('/preview', '_blank', 'width=900,height=1400');
  };

  const pages = chunkArray(resultadosFiltrados, 9);

  return (
    <Box sx={{ p: 5 }}>
      {/* Snackbar para alertas */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
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

        <FormControlLabel
          control={
            <Switch
              checked={accesoComputo === 1}
              onChange={handleToggleAcceso}
              color="primary"
            />
          }
          label="Acceso a Cómputo"
          sx={{ m: 0 }}
        />
      </Box>

      {/* AutocompleteCi separado debajo */}
      <Box sx={{ mb: 2 }}>
        <AutocompleteCi
          fetchData={fetchData}
          setResultadosFiltrados={setResultadosFiltrados}
        />
      </Box>



      <Grid container spacing={5} alignItems="center" sx={{ mb: 2 }}>
        <SideToggle side={side} onChange={setSide} />
        {resultadosFiltrados.length > 0 && (
          <>
            <Button variant="contained" onClick={handleDownloadPDF}>
              Descargar PDF
            </Button>
            <Button
              variant="outlined"
              color="primary.main"
              sx={{ ml: 2 }}
              onClick={handleOpenWindow}
            >
              Previsualizar
            </Button>
          </>
        )}
      </Grid>

      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}>
          {loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <CircularProgress />
  </Box>
) : resultadosFiltrados.length > 0 ? (
  <Box ref={printRef} sx={{ p: 0, m: 0, width: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
    <CredentialPages
      pages={pages}
      side={side}
      printRef={printRef}
      cargos={cargos}
      accesoComputo={accesoComputo}
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

export default CredentialPrintPage;