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

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet("/api/cargos").reply(200, [
  { id: 1, nombre: "ADM II TÉCNICO UGLE", color :	"Plomo", descripcion:	"Activo", seccion:	"UNIDAD DE GEOGRAFIA Y LOGISTICA ELECTORAL"},
  { id: 2, nombre: "ADMINISTRATIVO-CONTRATACIONES", color :	"Plomo", descripcion:	"Inactivo", seccion:	"SIFDE"},
  { id: 3, nombre: "ADMINISTRATIVO POA-RRHH", color :	"Plomo", descripcion:	"Activo", seccion:	"	ASESORIA LEGAL"},
  { id: 4, nombre: "ADMINISTRATIVO FINANCIERO - POA-RRHH", color :	"Plomo", descripcion:	"Inactivo", seccion:	"TECNOLOGÍAS"},
  { id: 5, nombre: "ADMINISTRATIVO DE CONTRATACIONES", color :	"Plomo", descripcion:	"Inactivo", seccion:	"SIFDE"},
  { id: 6, nombre: "ADMINISTRATIVO CONTRATACIONES", color :	"Plomo", descripcion:	"Activo", seccion:	"TECNOLOGÍAS"},
  { id: 7, nombre: "ADM III COORDINADOR ELECTORAL UGLE", color :	"Plomo", descripcion:	"Activo", seccion:	"TECNOLOGÍAS"},
  { id: 8, nombre: "TECNICO DE MONITOREO A NOTARIOS", color :	"Plomo", descripcion:	"Activo", seccion:	"UNIDAD DE GEOGRAFIA Y LOGISTICA ELECTORAL"},
  { id: 9, nombre: "TECNICO DE MONITOREO", color :	"Plomo", descripcion:	"Activo", seccion:	"SIFDE"},
  { id: 10, nombre: "TECNICO ADMINISTRATIVO", color :	"Plomo", descripcion:	"Activo", seccion:	"UNIDAD DE GEOGRAFIA Y LOGISTICA ELECTORAL"},
  { id: 11, nombre: "TECNICO - INSTALACION DE CAMARAS", color :	"Plomo", descripcion:	"Activo", seccion:	"SIFDE"},
  { id: 12, nombre: "TECNICO - INFRAESTRUCTURA DE REDES", color :	"Plomo", descripcion:	"Inactivo", seccion:	"TECNOLOGÍAS"},
  { id: 13, nombre: "APOYO ADMINISTRATIVO-CONTABILIDAD", color :	"Plomo", descripcion:	"Activo", seccion:	"SIFDE"},
]);

const GestionarCargo = () => {
  const [filtroGeneral, setFiltroGeneral] = useState('');

  const columns = [
    { id: 'nombre', label: 'Nombre Cargo', width: 180 },
    { id: 'color', label: 'Color', width: 20 },
    { id: 'descripcion', label: 'Descripción', width: 50 },
    { id: 'seccion', label: 'Sección', width: 180 },
    {
    id: 'opciones',
    label: 'Opciones',
    width: 50,
    render: (row) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <CustomEditIcon onClick={() => console.log("Editar " + row.id)} />
        <CustomDeleteIcon onClick={() => console.log("Eliminar " + row.id)} />
      </Box>
    )
  },
  ];
  
  const [cargos, setCargos] = useState([]);
  const [selectedRow, setSelectedRow] = useState({
    id : 0,
    nombre : '',
    color : '',
    descripcion : '',
    seccion : ''
  });

  useEffect(() => {
    obtenerListaCargos();
  }, []);

  const obtenerListaCargos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
      if (!response.ok) {
        throw new Error('Error al obtener la lista de cargos');
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      setCargos(data);
    } catch (error) {
      console.error("Error al obtener cargos:", error);
    }
  };
  

  return (
    <Grid container spacing={2} sx={{ width: '100%', padding: 2, margin: 0}}>
    <Grid span={12} sx={{width: '100%'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: 'calc(100vh - 100px)', 
        }}
      >
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
          rows={cargos.filter((cargo) => {
            const texto = filtroGeneral.toLowerCase();
            return (
              cargo.nombre.toLowerCase().includes(texto) ||
              cargo.seccion.toLowerCase().includes(texto) ||
              cargo.descripcion.toLowerCase().includes(texto) ||
              cargo.color.toLowerCase().includes(texto)
            );
          })}
          onClickRow={(row) => console.log(row)}
        />
      </Paper>
    </Box>
  </Grid>
</Grid>
  )
};

export default GestionarCargo;