import React, { useState, useRef, useEffect } from "react";
import { Select, MenuItem, TextField, Grid, Typography, Stack, Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";
import { useReactToPrint } from "react-to-print";
import CustomCredencial from "../organisms/CustomCredencial";

const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

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

const A4Page = React.forwardRef(({ children }, ref) => (
    <Box
        ref={ref}
        className="print-page"
        sx={{
            width: "21.59cm",
            height: "27.94cm",
            p: "1cm",
            boxSizing: "border-box",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.49cm",
            backgroundColor: "#fff",
            marginTop: "20px",
        }}
    >
        {children}
    </Box>
));

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

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `credenciales_${side}_${Date.now()}`,
        onBeforePrint: () => console.log("Antes de imprimir"),
        onAfterPrint: () => console.log("Después de imprimir"),
    });

    const handleFiltrar = async () => {
        if (!dateRange.start || !dateRange.end) return alert("Selecciona fechas.");
        if (!selectedCargo) return alert("Selecciona un cargo.");
        if (selectedCargo.nombre === "NOTARIO ELECTORAL" && !selectedRecinto) return alert("Selecciona una circunscripción.");

        const inicio = dateRange.start.toISOString().slice(0, 10);
        const fin = dateRange.end.toISOString().slice(0, 10);
        const cargo = selectedCargo.id;
        const circunscripcion = selectedCargo.nombre === "NOTARIO ELECTORAL" ? selectedRecinto : "";

        const result = await fetchData(inicio, fin, cargo, circunscripcion);
        if (result.res && Array.isArray(result.personal)) setResultadosFiltrados(result.personal);
        else alert("No se encontraron resultados o hubo un error.");
    };

    const pages = chunkArray(resultadosFiltrados, 9);

    return (
        <Box sx={{ p: 5 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
                <DateRangeFilter startDate={dateRange.start} endDate={dateRange.end} onChange={setDateRange} />
                <Autocomplete
                    disablePortal
                    options={cargos}
                    getOptionLabel={(option) => option.nombre || ""}
                    value={selectedCargo}
                    onChange={(_, value) => {
                        setSelectedCargo(value);
                        if (value?.nombre !== "NOTARIO ELECTORAL") setSelectedRecinto("");
                    }}
                    renderInput={(params) => <TextField {...params} label="Seleccione un cargo" size="small" />}
                    sx={{ width: 300 }}
                />
                {selectedCargo?.nombre === "NOTARIO ELECTORAL" && (
                    <Select
                        size="small"
                        value={selectedRecinto}
                        onChange={(e) => setSelectedRecinto(e.target.value)}
                        displayEmpty
                        sx={{ width: 200, mt: 1 }}
                    >
                        <MenuItem value="" disabled>Seleccione circunscripción</MenuItem>
                        {["C-2", "C-20", "C-21", "C-22", "C-23", "C-24", "C-25", "C-26", "C-27", "C-28"].map((circun) => (
                            <MenuItem key={circun} value={circun.split("-")[1]}>{circun}</MenuItem>
                        ))}
                    </Select>
                )}
                <Button variant="outlined" onClick={handleFiltrar}>Filtrar</Button>
            </Stack>

            <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <SideToggle side={side} onChange={setSide} />
                {resultadosFiltrados.length > 0 && (
                    <Button variant="contained" onClick={handlePrint}>Imprimir</Button>
                )}
            </Grid>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={8}>
                    {resultadosFiltrados.length > 0 ? (
                        <div ref={printRef}>
                            {pages.map((grupo, idx) => (
                                <CredentialSheet key={idx} persons={grupo} side={side} />
                            ))}
                        </div>
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