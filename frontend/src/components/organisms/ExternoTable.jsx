import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import CustomDeleteIcon from "../atoms/CustomDeleteIcon";
import CustomEditIcon from "../atoms/CustomEditIcon";

const ExternoTable = ({ data, onDeleteSuccess }) => {
  const [filters, setFilters] = useState({ tipo: "", activo: "" });
  const [orderBy, setOrderBy] = useState("tipo");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const showAlert = (msg, sev = "info") => setAlert({ open: true, message: msg, severity: sev });
  const closeAlert = () => setAlert({ ...alert, open: false });

  // ---- Ordenamiento
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  // ---- Filtrado
  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchTipo = (item.tipo || "").toLowerCase().includes(filters.tipo.toLowerCase());
      const matchActivo =
        filters.activo === ""
          ? true
          : filters.activo === "1"
          ? item.activo === 1
          : item.activo !== 1;
      return matchTipo && matchActivo;
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = (a[orderBy] || "").toString().toLowerCase();
      const valB = (b[orderBy] || "").toString().toLowerCase();
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, orderBy, order]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // ---- Exportaciones
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedData.map((item) => ({
        ID: item.id,
        Tipo: item.tipo,
        Activo: item.activo === 1 ? "Sí" : "No",
        Identificador: item.identificador,
        "Org. Política": item.organizacion_politica,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Prensa");
    XLSX.writeFile(wb, "prensa.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Tipo", "Activo", "Identificador", "Org. Política"]],
      body: sortedData.map((item) => [
        item.id,
        item.tipo,
        item.activo === 1 ? "Sí" : "No",
        item.identificador || "-",
        item.organizacion_politica || "-",
      ]),
    });
    doc.save("prensa.pdf");
  };

  return (
    <Box>
      {/* Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert severity={alert.severity} onClose={closeAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          label="Filtrar por Tipo"
          value={filters.tipo}
          onChange={handleFilterChange("tipo")}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Activo</InputLabel>
          <Select value={filters.activo} onChange={handleFilterChange("activo")}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="1">Sí</MenuItem>
            <MenuItem value="0">No</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ ml: "auto" }}>
          <Button onClick={exportToExcel} variant="outlined" size="small" sx={{ mr: 1 }}>
            Excel
          </Button>
          <Button onClick={exportToPDF} variant="outlined" size="small">
            PDF
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleSort("id")}
                  >
                   C. I. 
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "tipo"}
                    direction={orderBy === "tipo" ? order : "asc"}
                    onClick={() => handleSort("tipo")}
                  >
                    Tipo
                  </TableSortLabel>
                </TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Identificador</TableCell>
                <TableCell>Org. Política</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.ci}>
                  <TableCell>{item.ci}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.nombre_completo || "-"}</TableCell>
                  <TableCell>{item.identificador || "-"}</TableCell>
                  <TableCell>{item.organizacion_politica || "-"}</TableCell>
                  <TableCell>{item.activo === 1 ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <CustomEditIcon onClick={() => console.log("Editar", item.id)} />
                      <CustomDeleteIcon onClick={() => console.log("Eliminar", item.id)} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default ExternoTable;
