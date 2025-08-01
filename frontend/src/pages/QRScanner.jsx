import React, { useRef, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const qrCodeRegionId = 'qr-scanner-region';
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate(); 

  const startScanner = async () => {
    setError('');

    try {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log("QR detectado:", decodedText);
          stopScanner();
          navigate(`/accesoComputo/${encodeURIComponent(decodedText)}`); // 👈 redirigir
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

  return (
    <Paper sx={{ p: 3, maxWidth: 500, margin: 'auto', borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom>
        Escáner de Código QR
      </Typography>

      <Box
        id={qrCodeRegionId}
        sx={{
          width: '100%',
          height: 300,
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
        }}
      />

      <Box mt={2}>
        {!scanning && (
          <Button onClick={startScanner} variant="contained">
            Iniciar escáner
          </Button>
        )}

        {scanning && (
          <Button onClick={stopScanner} variant="outlined" color="secondary">
            Detener escáner
          </Button>
        )}

        {error && (
          <Typography mt={2} color="error">
            ⚠️ {error}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default QRScanner;