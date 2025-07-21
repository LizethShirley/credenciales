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
} from '@mui/material';

import CustomEditIcon from '../atoms/CustomEditIcon';
import CustomDeleteIcon from '../atoms/CustomDeleteIcon';
import EditFormModal from '../molecules/EditFormModel';

const CredencialesTable = ({ data, onDeleteSuccess }) => {
  const [filters, setFilters] = useState({
    cargo: '',
    recinto: '',
  });
  const [orderBy, setOrderBy] = useState('nombreCompleto');
  const [order, setOrder] = useState('asc');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = async (id) => {
    console.log("Editar");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/personal/${id}`);
      const result = await response.json();
      const resultP =result.personal;
      if (response.ok) {
        setSelectedUser({
          id: result.id,
          nombres: resultP.nombre || "ko",
          apellidoPaterno: resultP.paterno || "a",
          apellidoMaterno: resultP.materno || "la",
          numeroCarnet: resultP.ci || "",
          complemento: resultP.complemento || "",
          numeroCelular: resultP.celular || "",
          secciones: resultP.id_seccion?.toString() || "", 
          cargos: resultP.id_cargo?.toString() || "",
          recinto: resultP.ciexterno || "",
          codVerificacion: resultP.token || "",
          imagen: null, 
        });

        setModalOpen(true);
      } else {
        console.error("Error al obtener datos del personal:", result);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    }
  };


  const eliminarPersonal = async (id) => {
    console.log("Eliminar");
    const confirmar = window.confirm("¿Estás segura/o de eliminar este registro?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/personal/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (response.ok && res.res) {
        alert('Personal eliminado exitosamente');
        if (onDeleteSuccess) onDeleteSuccess(); 
      } else {
        alert(res.msg || 'No se pudo eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error inesperado');
    }
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
    return data.filter((item) =>
      (item.cargo_nombre || '').toLowerCase().includes(filters.cargo.toLowerCase()) &&
      (item.recinto_nombre || '').toLowerCase().includes(filters.recinto.toLowerCase())
    );
  }, [data, filters]);

  const getNombreCompleto = (item) =>
    `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.trim().toLowerCase();

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (orderBy === 'nombreCompleto') {
        const valA = getNombreCompleto(a);
        const valB = getNombreCompleto(b);
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      } else if (orderBy === 'cargo_nombre') {
        const valA = (a.cargo_nombre || '').toLowerCase();
        const valB = (b.cargo_nombre || '').toLowerCase();
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      }
      return 0;
    });
  }, [filteredData, order, orderBy]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <Box>
      {/* Filtros solo cargo y recinto */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar por Cargo"
          size="small"
          value={filters.cargo}
          onChange={handleFilterChange('cargo')}
        />
        <TextField
          label="Filtrar por Recinto"
          size="small"
          value={filters.recinto}
          onChange={handleFilterChange('recinto')}
        />
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
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
              <TableCell>Circunscripción</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${item.photo}`}
                      alt="foto"
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    'Sin foto'
                  )}
                </TableCell>
                <TableCell>{`${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`}</TableCell>
                <TableCell>{item.ci}</TableCell>
                <TableCell>{item.cargo_nombre}</TableCell>
                <TableCell>{item.seccion_nombre}</TableCell>
                <TableCell>{item.ciexterno}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CustomEditIcon onClick={() => handleEditClick(item.id)}/>
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
      {/* Modal */}
      {selectedUser && (
        <EditFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialValues={selectedUser}
        />
      )}
    </Box>
  );
};

export default CredencialesTable;

