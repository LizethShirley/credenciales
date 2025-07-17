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
import CustomAddIcon from '../../components/atoms/CustomAddIcon';

const GestionarUnidad = () => {
  const [filtroGeneral, setFiltroGeneral] = useState('');
  
  const columns = [
    { id: 'nombre', label: 'Nombre Unidad', width: 180 },
    { id: 'abreviatura', label: 'Abreviatura', width: 50 },
    { id: 'estado', label: 'Estado', width: 50 },
    {
      id: 'opciones',
      label: 'Opciones',
      width: 100,
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton>
          <GroupAddIcon/>
        </IconButton>
          <CustomEditIcon onClick={() => console.log("Editar " + row.id)} />
          <CustomDeleteIcon onClick={() => console.log("Eliminar " + row.id)} />
        </Box>
      )
    },
  ];
    
  const [unidad, setUnidad] = useState([]);
  
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
      <Box sx={{ width: '100%', maxWidth: 900 }}>
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
          <CustomAddIcon onClick={() => console.log("Añadir")}/>
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
                unidad.nombre.toLowerCase().includes(texto) ||
                unidad.abreviatura.toLowerCase().includes(texto) ||
                unidad.estado.toLowerCase().includes(texto)
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