import React, { useRef, useState } from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const qrCodeRegionId = 'qr-scanner-region';
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate(); 

  const startScanner = async () => {
    setError('');
    setScannedText('');
    try {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log("QR detectado:", decodedText);
          setScannedText(decodedText);
          stopScanner();

          // Redirigir automáticamente según el formato
          if (decodedText.startsWith("externo/")) {
            navigate(`/accesoObservador/${encodeURIComponent(decodedText)}`);
          } else {
            navigate(`/accesoComputo/${encodeURIComponent(decodedText)}`);
          }
        },
        (scanError) => {
          console.warn("Scan error:", scanError);
        }
      );

      setScanning(true);
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
      setError('No se pudo iniciar la cámara: ' + (err?.message || JSON.stringify(err)));
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error al detener el escáner:', err);
      }
    }
    setScanning(false);
  };

  const handleClear = () => {
    setScannedText('');
    setError('');
    stopScanner();
  };

  const handleExit = () => {
    window.close();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, margin: 'auto', borderRadius: 3 }}>
      <Box>
        <Grid container spacing={0.5} flexDirection="row" justifyContent={'center'} mb={1}>
          <img src={`/TEDLogo.png`} alt="Logo TED" style={{ width: '35px', height:'100%' }} />
          <Box backgroundColor="primary.main" width="1px" />
          <img src={`/EleccionesLogo.png`} alt="Logo Elecciones" style={{ width: '70px', height:'100%'  }} />
        </Grid>
        <Typography align="center" color="primary.main" fontSize={12} lineHeight={1.2}>
          {"ELECCIONES JUDICIALES 2025"}
          <br/>
          {"SISTEMA DE ACCESO CÓMPUTO"}
          <br/><br/>
        </Typography>
      </Box>
      <Box
        id={qrCodeRegionId}
        sx={{
          width: '100%',
          height: 300,
          border: '1px solid #ccc',
          position: 'relative',
        }}
      />
      <Box mt={2} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
        {!scanning && (
          <Button onClick={startScanner} variant="contained" sx={{color: 'white', backgroundColor: '#07854E'}}>
            ESCANEAR
          </Button>
        )}
        {scanning && (
          <Button onClick={stopScanner} variant="outlined" sx={{color: '#FFFFFF', backgroundColor: 'primary.main'}}>
            Detener escáner
          </Button>
        )}
        <Button onClick={handleClear} variant="outlined" color="secondary">
          Limpiar
        </Button>
        <Button onClick={handleExit} variant="outlined" color="error">
          Salir
        </Button>
      </Box>
      {error && (
        <Typography mt={2} color="error">
          ⚠️ {error}
        </Typography>
      )}
    </Paper>
  );
};

export default QRScanner;