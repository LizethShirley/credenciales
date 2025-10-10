import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import CredencialesTable from '../../components/organisms/CredencialesTable';

const ListaCredenciales = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCI, setFiltroCI] = useState('');
  const [personal, setPersonal] = useState([]);
  const [ordenAsc, setOrdenAsc] = useState(true);

  useEffect(() => {
    obtenerPersonal();
  }, []);

  const obtenerPersonal = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal`);
      const data = await response.json();

      // Mostrar inmediatamente la información básica
      setPersonal(data.personal.map(p => ({ ...p, foto: null })));

      // Luego, cargar las fotos una por una o en paralelo
      data.personal.forEach(async (persona, index) => {
        if (persona.foto_url) {
          const img = new Image();
          img.src = persona.foto_url;
          img.onload = () => {
            setPersonal(prev => {
              const actualizado = [...prev];
              actualizado[index].foto = persona.foto_url;
              return actualizado;
            });
          };
        }
      });
    } catch (error) {
      console.error("Error al obtener personal:", error);
    }
  };


  const personalFiltrado = personal
    .filter((item) => {
      const nombreCompleto = `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.toLowerCase();
      //const nombreCompleto = item.nombre_completo?.toLowerCase();
      const ciTexto = item.ci?.toLowerCase() || '';
      return (
        nombreCompleto.includes(filtroNombre.toLowerCase()) &&
        ciTexto.includes(filtroCI.toLowerCase())
      );
    })
    .sort((a, b) => {
      const cargoA = a.cargo_nombre?.toLowerCase() || '';
      const cargoB = b.cargo_nombre?.toLowerCase() || '';
      return ordenAsc ? cargoA.localeCompare(cargoB) : cargoB.localeCompare(cargoA);
    });

  // ✅ función para pasar al hijo y abrir ventana de edición
  const abrirVentanaEdicion = (idPersonal) => {
    const nuevaVentana = window.open(
      `/editar-personal/${idPersonal}`,
      '_blank',
      'width=800,height=600'
    );

    const timer = setInterval(() => {
      if (nuevaVentana.closed) {
        clearInterval(timer);
        obtenerPersonal(); // 🔄 recargar datos al cerrar la ventana
      }
    }, 500);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1010 }}>
        <Typography variant="h5" align="center">Lista de Personal</Typography>

        <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
          <TextField
            label="Buscar por nombre completo..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            size="small"
            sx={{ width: 250 }}
          />
          <TextField
            label="Buscar por CI..."
            value={filtroCI}
            onChange={(e) => setFiltroCI(e.target.value)}
            size="small"
            sx={{ width: 200 }}
          />
        </Box>

        <CredencialesTable
          data={personalFiltrado}
          onDeleteSuccess={obtenerPersonal}
          onEditClick={abrirVentanaEdicion}
        />
      </Box>
    </Box>
  );
};

export default ListaCredenciales;