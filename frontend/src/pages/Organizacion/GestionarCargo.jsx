import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';

import { Search as SearchIcon, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import CustomTable from '../../components/organisms/CustomTable';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import EditCargoModal from '../../components/organisms/EditCargoModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const GestionarCargo = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [cargos, setCargos] = useState([]);
  const [ordenNombreAsc, setOrdenNombreAsc] = useState(true);
  const [ordenSeccionAsc, setOrdenSeccionAsc] = useState(true);
  const [ordenarPor, setOrdenarPor] = useState('seccion'); // 'seccion' | 'nombre'

  const eliminarCargo = async (id, onDeleteSuccess) => {
    const confirmar = window.confirm("¿Estás segura/o de eliminar este registro?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cargos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await response.json();

      if (response.ok && res.res) {
        alert('Cargo eliminado exitosamente');
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

  const obtenerListaCargos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos-secciones`);
      if (!response.ok) throw new Error('Error al obtener la lista de cargos');
      const data = await response.json();
      setCargos(data.cargos);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };

  useEffect(() => {
    obtenerListaCargos();
  }, []);

  // Filtrar por nombre + Ordenar
  const rowsOrdenadosYFiltrados = useMemo(() => {
    const texto = filtroNombre.trim().toLowerCase();
    return cargos
      .filter((c) => c.nombre.toLowerCase().includes(texto))
      .sort((a, b) => {
        if (ordenarPor === 'seccion') {
          const comp = a.seccion.localeCompare(b.seccion);
          return ordenSeccionAsc ? comp : -comp;
        } else {
          const comp = a.nombre.localeCompare(b.nombre);
          return ordenNombreAsc ? comp : -comp;
        }
      });
  }, [cargos, filtroNombre, ordenarPor, ordenNombreAsc, ordenSeccionAsc]);

  const columns = [
    {
      id: 'nombre',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Nombre Cargo
          <IconButton
            size="small"
            onClick={() => {
              setOrdenarPor('nombre');
              setOrdenNombreAsc(!ordenNombreAsc);
            }}
          >
            {ordenarPor === 'nombre' && !ordenNombreAsc ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )}
          </IconButton>
        </Box>
      ),
      width: 180,
    },
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
    {
      id: 'seccion',
      label: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Sección
          <IconButton
            size="small"
            onClick={() => {
              setOrdenarPor('seccion');
              setOrdenSeccionAsc(!ordenSeccionAsc);
            }}
          >
            {ordenarPor === 'seccion' && !ordenSeccionAsc ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )}
          </IconButton>
        </Box>
      ),
      width: 180,
    },
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

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 1100 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Lista de Cargos
        </Typography>

        {/* Campo de búsqueda por nombre */}
        <Box sx={{ mb: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
            rows={rowsOrdenadosYFiltrados}
            onClickRow={(row) => console.log(row)}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default GestionarCargo;