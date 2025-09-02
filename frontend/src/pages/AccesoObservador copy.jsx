import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function AccesoObservador() {
  // Soporta /accesoObservador/:tipo/:codigo y /accesoObservador?token=externo/RIMA7
  const { tipo, codigo } = useParams();
  const [search] = useSearchParams();
  const tokenFromQuery = search.get('token');
  const token = tokenFromQuery || (tipo && codigo ? `${tipo}/${codigo}` : null);

  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasCalled = useRef(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);

  // ---- TTS seguro ----
  const speakText = (text) => {
    try {
      if (!text) return;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('speechSynthesis no disponible', e);
    }
  };

  useEffect(() => {
    if (respuesta?.msg) speakText(respuesta.msg);
    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (_) {}
    };
  }, [respuesta?.msg]);

  // ---- Llamada inicial ----
  useEffect(() => {
    if (token && !hasCalled.current) {
      registrarAcceso(token);
      hasCalled.current = true;
    }
  }, [token]);

  // ---- Progreso visual mientras carga ----
  useEffect(() => {
    if (loading) {
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
      }, 200);
    } else {
      setProgress(100);
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [loading]);

  const registrarAcceso = async (tokenParam) => {
    setLoading(true);
    setError(null);
    setRespuesta(null);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);

    try {
      // 🔑 Aquí va el token como query param
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/registro-acceso/registrar/?token=${encodeURIComponent(
          tokenParam
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || 'Error al registrar acceso');
      } else {
        setRespuesta(data);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Tiempo de espera agotado. Intente nuevamente.');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      clearTimeout(id);
      setLoading(false);
    }
  };
  console.log(respuesta);
  return (
    <Grid
      padding={1}
      margin={1}
      minHeight={'95vh'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={3}
        style={{
          borderRadius: '15px',
          backgroundColor: '#f9f9f9',
          width: '100%',
          height: '100%',
          maxWidth: 600,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              my: 2,
              position: 'relative',
            }}
          >
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
            />
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                color: 'black',
              }}
            >
              {`${progress}%`}
            </Typography>
          </Box>
        )}

        {error && (
          <Typography
            variant="body1"
            align="center"
            style={{ color: 'red', marginBottom: 8 }}
          >
            {error}
          </Typography>
        )}

        {respuesta && (
          <Box padding={1} style={{ textAlign: 'center' }}>
            <Box
              marginBottom={1}
              backgroundColor={
                respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
              }
              padding={2}
              borderRadius={3}
            >
              <Typography
                color="#FFFFFF"
                sx={{ fontWeight: 'bold', letterSpacing: 3, fontSize: "25pt" }}
              >
                {`${respuesta.tipo_credencial}`.toUpperCase()}
              </Typography>
            </Box>

            <Grid
              container
              spacing={0.5}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid container spacing={0.5} flexDirection="row">
                <img
                  src={`/TEDLogo.jpg`}
                  alt="Logo TED"
                  style={{ width: '70px', height: '100%' }}
                />
                <Box backgroundColor="primary.main" width="1.5px"></Box>
                <img
                  src={`/EleccionesLogo.png`}
                  alt="Logo Elecciones"
                  style={{ width: '90px', height: '100%' }}
                />
              </Grid>

              <Grid container spacing={0.5} flexDirection="row" color="#FFFFFF">
                <Box
                  backgroundColor={
                    respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
                  }
                  padding={1}
                  borderRadius={2}
                  height="100%"
                  mr={1}
                >
                  <CalendarMonthIcon />
                  <Typography variant="body1">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Box
                  backgroundColor={
                    respuesta.tipo === 'entrada' ? '#1AB394' : '#F8AC59'
                  }
                  padding={1}
                  borderRadius={2}
                  height="100%"
                >
                  <AccessAlarmsIcon />
                  <Typography variant="body1">
                    {new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Grid>
  );
}

export default AccesoObservador;