import React, { useMemo, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
  Checkbox,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';

import CustomEditIcon from '../atoms/CustomEditIcon';
import CustomDeleteIcon from '../atoms/CustomDeleteIcon';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const CredencialesTable = ({ data, onDeleteSuccess }) => {
  const [filters, setFilters] = useState({ cargo: '', recinto: '' });
  const [orderBy, setOrderBy] = useState('nombreCompleto');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedRows, setSelectedRows] = useState([]); 
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, onConfirm: null, title: '' });
  const [selectedModalOpen, setSelectedModalOpen] = useState(false);

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };
  const closeAlert = () => setAlert({ ...alert, open: false });

  const openEditPersonal = (id_personal) => {
    const url = `https://walisanga.space/credenciales-2025/${id_personal}`;
    window.open(
      url,
      'EditarPersonal',
      'width=1000,height=700,scrollbars=yes,resizable=yes'
    );
  };

  const eliminarPersonal = (id) => {
    setConfirmDialog({
      open: true,
      title: '¿Estás segura/o de eliminar este registro?',
      onConfirm: async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/personal/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
          const res = await response.json();
          if (response.ok && res.res) {
            showAlert('Personal eliminado exitosamente', 'success');
            if (onDeleteSuccess) onDeleteSuccess();
          } else {
            showAlert(res.msg || 'No se pudo eliminar', 'error');
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
          showAlert('Hubo un error inesperado', 'error');
        } finally {
          setConfirmDialog({ open: false, onConfirm: null, title: '' });
        }
      }
    });
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleFilterChange = (field) => (e) => {
    setFilters({ ...filters, [field]: e.target.value });
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (item.cargo_nombre || '').toLowerCase().includes(filters.cargo.toLowerCase()) &&
        (item.recinto_nombre || '').toLowerCase().includes(filters.recinto.toLowerCase())
    );
  }, [data, filters]);

  const getNombreCompleto = (item) =>
    `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.trim();

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const compare = (valA, valB) => {
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      };

      if (orderBy === 'nombreCompleto') {
        return compare(getNombreCompleto(a).toLowerCase(), getNombreCompleto(b).toLowerCase());
      } else if (orderBy === 'cargo_nombre') {
        return compare((a.cargo_nombre || '').toLowerCase(), (b.cargo_nombre || '').toLowerCase());
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((item) => item.id);
      setSelectedRows((prev) => [...new Set([...prev, ...allIds])]);
    } else {
      const remaining = selectedRows.filter((id) => !paginatedData.some((item) => item.id === id));
      setSelectedRows(remaining);
    }
  };

  const mostrarSeleccionados = async () => {
    if (selectedRows.length === 0) {
      showAlert('No hay seleccionados', 'warning');
      return;
    }

    setSelectedModalOpen(true);
  };

  const generarQR = async () => {
    const form = new FormData();
    selectedRows.forEach((id) => form.append('personal_ids[]', id));
    form.append('accesoComputo', '1');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/acceso-computo/generar-qr`, {
        method: 'POST',
        body: form,
      });

      const result = await res.json();
      if (res.ok) {
        showAlert('QR generado exitosamente', 'success');
        setSelectedRows([]);
        setSelectedModalOpen(false);
      } else {
        showAlert(result.msg || 'Error al generar QR', 'error');
      }
    } catch (error) {
      console.error('Error al generar QR:', error);
      showAlert('Hubo un error al conectar con la API', 'error');
    }
  };

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((item) => selectedRows.includes(item.id));

  return (
    <Box>
      {/* Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}>
        <Alert severity={alert.severity} onClose={closeAlert} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, onConfirm: null, title: '' })}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, onConfirm: null, title: '' })}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={confirmDialog.onConfirm}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de seleccionados */}
      <Dialog open={selectedModalOpen} onClose={() => setSelectedModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Seleccionados</DialogTitle>
        <DialogContent dividers>
          {sortedData.filter((item) => selectedRows.includes(item.id)).map((s) => (
            <Typography key={s.id}>{getNombreCompleto(s)}</Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedModalOpen(false)}>Cerrar</Button>
          <Button variant="contained" onClick={generarQR}>Generar QR</Button>
        </DialogActions>
      </Dialog>

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar por Cargo"
          size="small"
          value={filters.cargo}
          onChange={handleFilterChange('cargo')}
        />
      </Box>

      <Button variant="contained" onClick={mostrarSeleccionados} sx={{ mb: 2 }}>
        Habilitar Acceso Computo
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
              </TableCell>
              <TableCell>Foto</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'nombreCompleto'}
                  direction={orderBy === 'nombreCompleto' ? order : 'asc'}
                  onClick={() => handleSort('nombreCompleto')}
                >
                  Nombre Completo
                </TableSortLabel>
              </TableCell>
              <TableCell>CI</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'cargo_nombre'}
                  direction={orderBy === 'cargo_nombre' ? order : 'asc'}
                  onClick={() => handleSort('cargo_nombre')}
                >
                  Cargo
                </TableSortLabel>
              </TableCell>
              <TableCell>Sección</TableCell>
              <TableCell>C</TableCell>
              <TableCell>A. C.</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(item.id)}
                    onChange={() => toggleSelectRow(item.id)}
                  />
                </TableCell>
                <TableCell>
                  {item.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${item.photo}`}
                      alt="foto"
                      width={40}
                      height={40}
                      style={{ borderRadius: '20%' }}
                    />
                  ) : (
                    'Sin foto'
                  )}
                </TableCell>
                <TableCell>{getNombreCompleto(item)}</TableCell>
                <TableCell>{item.ci}</TableCell>
                <TableCell>{item.cargo_nombre}</TableCell>
                <TableCell>{item.seccion_nombre}</TableCell>
                <TableCell>{item.ciexterno}</TableCell>
                <TableCell>{item.accesoComputo === 0 ? 'No' : 'Sí'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      sx={{ color: '#25D366' }}
                      onClick={() => window.open(`https://wa.me/${item.celular}`, '_blank')}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                    <CustomEditIcon onClick={() => openEditPersonal(item.id)} />
                    <CustomDeleteIcon onClick={() => eliminarPersonal(item.id)} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          labelRowsPerPage="Filas por página:"
        />
      </TableContainer>
    </Box>
  );
};

export default CredencialesTable;