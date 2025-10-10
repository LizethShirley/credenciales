import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import ExternoTable from '../../components/organisms/ExternoTable';

const ListaCredencialesExterno = () => {
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroCI, setFiltroCI] = useState('');
  const [personal, setPersonal] = useState([]);
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 obtener datos desde API
  const obtenerPersonal = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/acceso-computo-observadores/filter`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener personal`);
      }
      const data = await response.json();
      setPersonal(data.acceso_computo_observadores || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    obtenerPersonal();
  }, [obtenerPersonal]);

  // 📌 Filtrado y ordenamiento con useMemo (mejor performance)
  const personalFiltrado = useMemo(() => {
    return personal
      .filter((item) => {
        const nombreCompleto = item.nombre_completo?.toLowerCase() || '';
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
  }, [personal, filtroNombre, filtroCI, ordenAsc]);

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
        obtenerPersonal(); // 🔄 recargar datos al cerrar
      }
    }, 500);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 1010 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Lista Externo
        </Typography>

        {/* 🟡 Barra de búsqueda */}
        <Box sx={{ my: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
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

        {/* ⏳ Loader y errores */}
        {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 2 }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {/* 📋 Tabla (solo si hay datos) */}
        {!loading && !error && (
          <ExternoTable
            data={personalFiltrado}
            onDeleteSuccess={obtenerPersonal}
          />
        )}
      </Box>
    </Box>
  );
};

export default ListaCredencialesExterno;
