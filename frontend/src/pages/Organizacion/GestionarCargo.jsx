import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';

import { Description, Search as SearchIcon } from '@mui/icons-material';
import CustomTable from '../../components/organisms/CustomTable';
import CustomEditIcon from '../../components/atoms/CustomEditIcon';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import CustomAddIcon from '../../components/atoms/CustomAddIcon';
import EditCargoModal from '../../components/organisms/EditCargoModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const GestionarCargo = () => {
  const [filtroGeneral, setFiltroGeneral] = useState('');

  const columns = [
    { id: 'nombre', label: 'Nombre Cargo', width: 180 },
    { id: 'color', label: 'Color', width: 20 },
    {
      id: 'estado',
      label: 'Estado',
      width: 50,
      render: (row) =>
        row.estado === 1 ? (
          <CheckCircleIcon color="success" titleAccess="Habilitado" />
        ) : (
          <CancelIcon color="error" titleAccess="Inhabilitado" />
        ),
    },
    { id: 'seccion', label: 'Sección', width: 100 },
    {
    id: 'opciones',
    label: 'Opciones',
    width: 50,
    render: (row) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <EditCargoModal cargo={row} onSuccess={obtenerListaCargos} />
        <CustomDeleteIcon onClick={() => eliminarCargo(row.id, () => eliminarCargoDeLista(row.id))} />
      </Box>
    )
  },
  ];
  
  const [cargos, setCargos] = useState([]);

  const eliminarCargo = async (id, onDeleteSuccess) => {
    const confirmar = window.confirm("¿Estás segura/o de eliminar este registro?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cargos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (response.ok && res.res) {
        alert('Cargo eliminada exitosamente');
        if (onDeleteSuccess) onDeleteSuccess(); 
      } else {
        alert(res.msg || 'No se pudo eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error inesperado');
    }
  };

  const eliminarCargoDeLista = (id) => {
    setCargos((prev) => prev.filter((cargos) => cargos.id !== id));
  };

  useEffect(() => {
    obtenerListaCargos();
  }, []);

  const obtenerListaCargos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos-secciones`);
      if (!response.ok) {
        throw new Error('Error al obtener la lista de cargos');
      }
      const data = await response.json();
      console.log("Datos recibidos:", data.cargos);
      setCargos(data.cargos);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };
  

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Lista de Cargos
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
        }} >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography variant="body1">Buscar:</Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar en la tabla..."
              value={filtroGeneral}
              onChange={(e) => setFiltroGeneral(e.target.value)}
              sx={{ width: 300 }}
            />
        </Box>
      </Box>
      <Paper
        sx={{
          width: '100%',
          padding: 2,
          boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <CustomTable
          columns={columns}
          rows={cargos.filter((cargo) => {
            const texto = filtroGeneral.toLowerCase();
            return (
              cargo.nombre.toLowerCase().includes(texto) ||
              cargo.seccion.toLowerCase().includes(texto) ||
              cargo.estado.toLowerCase().includes(texto) ||
              cargo.color.toLowerCase().includes(texto)
            );
          })}
          onClickRow={(row) => console.log(row)}
        />
      </Paper>
    </Box>
  </Box>
  )
};

export default GestionarCargo;