import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CustomTable from '../../components/organisms/CustomTable';
import CustomEditIcon from '../../components/atoms/CustomEditIcon';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import AddUnidadModalWrapper from '../../components/organisms/AddUnidadModalWrapper';
import CustomFormCargo from '../../components/organisms/CustomFormCargo';
import EditUnidadModal from '../../components/organisms/EditUnidadModal';

const GestionarUnidad = () => {
  const [filtroGeneral, setFiltroGeneral] = useState('');
  
  const columns = [
    { id: 'nombre', label: 'Nombre Unidad', width: 180 },
    { id: 'abreviatura', label: 'Abreviatura', width: 50 },
    { id: 'estado', label: 'Estado', width: 50 },
    {
      id: 'opciones',
      label: 'Opciones',
      width: 90,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CustomFormCargo idseccion={row.id}/>
          <EditUnidadModal unidad={row} onSuccess={obtenerListaUnidad} />
          <CustomDeleteIcon onClick={() => eliminarUnidad(row.id, () => eliminarUnidadDeLista(row.id))} />
        </Box>
      )
    },
  ];
    
  const [unidad, setUnidad] = useState([]);
  
  const eliminarUnidad = async (id, onDeleteSuccess) => {
    const confirmar = window.confirm("¿Estás segura/o de eliminar este registro?");
    if (!confirmar) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/secciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res = await response.json();

      if (response.ok && res.res) {
        alert('Unidad eliminada exitosamente');
        if (onDeleteSuccess) onDeleteSuccess(); // ✅ ahora está definido correctamente
      } else {
        alert(res.msg || 'No se pudo eliminar');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error inesperado');
    }
  };

  const eliminarUnidadDeLista = (id) => {
    setUnidad((prev) => prev.filter((unidad) => unidad.id !== id));
  };


  useEffect(() => {
    obtenerListaUnidad();
  }, []);
  
  const obtenerListaUnidad = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/secciones`);
      if (!response.ok) {
        throw new Error('Error al obtener la lista de secciones');
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      setUnidad(data);
    } catch (error) {
      console.error("Error al obtener secciones:", error);
    }
  };
    
  
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 1000 }}>
        <Typography variant='h5' align='center' gutterBottom>
          Lista de Unidad
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
          <AddUnidadModalWrapper
            onSuccess={(nuevaUnidad) => {
              // Actualiza tu estado unidad para que incluya la nueva unidad sin recargar
              setUnidad((prev) => [...prev, nuevaUnidad]);
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
            rows={unidad.filter((unidad) => {
              const texto = filtroGeneral.toLowerCase();
              return (
                (unidad.nombre?.toLowerCase() || "").includes(texto) ||
                (unidad.abreviatura?.toLowerCase() || "").includes(texto) ||
                (String(unidad.estado)).toLowerCase().includes(texto)
              );
            })}
            onClickRow={(row) => console.log(row)}
          />
        </Paper>
      </Box>
    </Box>
  )
};
export default GestionarUnidad;