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

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet("/api/unidad").reply(200, [
  { id: 1, nombre: "ADM II TÉCNICO UGLE", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 2, nombre: "ADMINISTRATIVO-CONTRATACIONES", abreviatura :	"Plomo", estado:	"Inactivo"},
  { id: 3, nombre: "ADMINISTRATIVO POA-RRHH", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 4, nombre: "ADMINISTRATIVO FINANCIERO - POA-RRHH", abreviatura :	"Plomo", estado:	"Inactivo"},
  { id: 5, nombre: "ADMINISTRATIVO DE CONTRATACIONES", abreviatura :	"Plomo", estado:	"Inactivo"},
  { id: 6, nombre: "ADMINISTRATIVO CONTRATACIONES", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 7, nombre: "ADM III COORDINADOR ELECTORAL UGLE", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 8, nombre: "TECNICO DE MONITOREO A NOTARIOS", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 9, nombre: "TECNICO DE MONITOREO", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 10, nombre: "TECNICO ADMINISTRATIVO", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 11, nombre: "TECNICO - INSTALACION DE CAMARAS", abreviatura :	"Plomo", estado:	"Activo"},
  { id: 12, nombre: "TECNICO - INFRAESTRUCTURA DE REDES", abreviatura :	"Plomo", estado:	"Inactivo"},
  { id: 13, nombre: "APOYO ADMINISTRATIVO-CONTABILIDAD", abreviatura :	"Plomo", estado:	"Activo"},
]);

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
  const [selectedRow, setSelectedRow] = useState({
    id : 0,
    nombre : '',
    color : '',
    descripcion : '',
    seccion : ''
  });
  
  useEffect(() => {
    obtenerListaUnidad();
  }, []);
  
  const obtenerListaUnidad = async () => {
    const response = await axios.get('/api/unidad');
    setUnidad(response.data);
  }
    
  
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
                unidad.seccion.toLowerCase().includes(texto) ||
                unidad.descripcion.toLowerCase().includes(texto) ||
                unidad.color.toLowerCase().includes(texto)
              );
            })}
            onClickRow={(row) => console.log(row)}
          />
        </Paper>
      </Box>
    </Grid>
  </Grid>
)};

export default GestionarUnidad;