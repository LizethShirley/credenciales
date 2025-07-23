import { useState, useRef, useEffect } from "react";
import { Grid, Typography, Stack, Box, Button } from "@mui/material";
import DateRangeFilter from "../atoms/DateRangerFilter";
import SideToggle from "../atoms/SideToggle";
import PrintPageWrapper from "../organisms/PrintPageWrapper";
import CredentialPages from "../organisms/CredenctialPageGroup";
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
  // Abrir ventana nueva con las credenciales
  const handleOpenWindow = () => {
    // Guardar los datos en localStorage para la vista previa
    localStorage.setItem('credenciales_preview_pages', JSON.stringify(pages));
    localStorage.setItem('credenciales_preview_side', side);
    window.open('/preview', '_blank', 'width=900,height=1400');
  };
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [side, setSide] = useState("anverso");
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedRecinto, setSelectedRecinto] = useState("");
  const printRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        setCargos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCargos();
  }, []);

  const handleFiltrar = async () => {
    setLoading(true);
    if (!dateRange.start || !dateRange.end) return alert("Selecciona fechas.");
    if (!selectedCargo) return alert("Selecciona un cargo.");
    if (
      selectedCargo.nombre === "NOTARIO ELECTORAL" &&
      !selectedRecinto
    ) return alert("Selecciona una circunscripción.");

    const inicio = dateRange.start.toISOString().slice(0, 10);
    const fin = dateRange.end.toISOString().slice(0, 10);
    const cargo = selectedCargo.id;
    const circunscripcion =
      selectedCargo.nombre === "NOTARIO ELECTORAL" ? selectedRecinto : "";

    try {
      const result = await fetchData(inicio, fin, cargo, circunscripcion);
      await new Promise((res) => setTimeout(res, 2000));
      if (result.res && Array.isArray(result.personal))
        setResultadosFiltrados(result.personal);
      else alert("No se encontraron resultados o hubo un error.");
    } catch (error) {
      console.error(error);
      alert("Error al filtrar los datos.");
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
      html2canvas: {
        scale: 2, // mejor calidad
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };


    // Usar solo el modo 'pdf' para que html2pdf renderice como documento, no como imagen
    html2pdf().set(options).from(element).toPdf().save();
  };


  // Divide los resultados en páginas de 9 elementos (A4)
  const pages = chunkArray(resultadosFiltrados, 9);

  return (
    <Box sx={{ p: 5 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
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
          sx={{ minWidth: 220 }}
        />
        <Button variant="contained" onClick={handleFiltrar} sx={{ height: 40, minWidth: 120 }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Filtrar"}
        </Button>
      </Stack>
      
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <AutocompleteCi
          fetchData={fetchData}
          setResultadosFiltrados={setResultadosFiltrados}
        />
      </Stack>

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
        <Grid item xs={12} md={8}>
          {resultadosFiltrados.length > 0 ? (
            <Box ref={printRef} sx={{ p: 0, m: 0, width: 'auto', backgroundColor: 'transparent', boxShadow: 'none' }}>
              <CredentialPages pages={pages} side={side} printRef={printRef} cargos={cargos}/>
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
