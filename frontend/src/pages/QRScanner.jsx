import { useRef, useState } from 'react';
import AccesoComputo from './AccesoComputo';
import AccesoObservador from './AccesoObservador';
import { Box, Typography, Paper, Button, Grid, Dialog, DialogTitle } from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = () => {
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const [openInfo, setOpenInfo] = useState(false);
  const qrCodeRegionId = 'qr-scanner-region';
  const html5QrCodeRef = useRef(null); 
  
  const startScanner = async () => {
    setError('');
    setScannedText('');
    const scannerRegion = document.getElementById(qrCodeRegionId);
    if (scannerRegion) scannerRegion.innerHTML = '';
  
    try {
      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      html5QrCodeRef.current = html5QrCode;
  
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          console.log("QR detectado:", decodedText);
          setScannedText(decodedText.replace('/', '-')); // convertimos "/" → "-" para URL
          stopScanner();
        },
        (scanError) => {
          console.warn("Scan error:", scanError);
        }
      );
  
      setScanning(true);
    } catch (err) {
      setError('No se pudo iniciar la cámara: ' + (err?.message || JSON.stringify(err)));
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
      } catch (err) {
        console.warn("Error al detener:", err);
      }

      try {
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("Error al limpiar:", err);
      }

      html5QrCodeRef.current = null;
    }

    const scannerRegion = document.getElementById(qrCodeRegionId);
    if (scannerRegion) scannerRegion.innerHTML = '';
    setScanning(false);
  };

  const handleClear = async () => {
    setScannedText('');
    setError('');
    await stopScanner();   // 🔥 ahora sí detiene bien
  };

  const handleInfo = () => setOpenInfo(true);

  // --- decidir componente ---
  const renderAcceso = () => {
    if (!scannedText) return null;

    if (scannedText.startsWith('externo-')) {
      // Observador
      return <AccesoObservador token={scannedText} />;
    } else {
      // Computo
      return <AccesoComputo token={scannedText} />;
    }
  };

  return (
    <Paper sx={{ p:3, maxWidth:500, margin:'auto', borderRadius:3, height:600, position:'relative' }}>
      <Box>
        <Grid container spacing={0.5} flexDirection="row" justifyContent={'center'} mb={1}>
          <img src={`/TEDLogo.png`} alt="Logo TED" style={{ width: '35px', height: '100%' }} />
          <Box backgroundColor="primary.main" width="1px" />
          <img src={`/EleccionesLogo.png`} alt="Logo Elecciones" style={{ width: '70px', height: '100%' }} />
        </Grid>

        <Typography align="center" color="primary.main" fontSize={12} lineHeight={1.2}>
          {"ELECCIONES GENERALES 2025"}
          <br />
          {"SISTEMA DE ACCESO CÓMPUTO"}
          <br /><br />
        </Typography>

        <Box id={qrCodeRegionId} sx={{
          width:'100%', height:'400px', borderRadius:2, border:'2px dashed #ccc',
          backgroundImage:`url('/EleccionesLogo.png')`, backgroundSize:'80% auto',
          backgroundRepeat:'no-repeat', backgroundPosition:'center center', position:'relative', overflow:'hidden', opacity:0.5
        }} />

        {scannedText && (
          <Box sx={{ position:'absolute', inset:0, backgroundColor:'rgba(255,255,255,0.9)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Box sx={{ backgroundSize: "100% 100%" }}>
              {renderAcceso()}
            </Box>
          </Box>
        )}
      </Box>

      <Box mt={2} display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
        {!scanning && (
          <Button onClick={async ()=>{ await stopScanner(); await startScanner(); }} variant="contained" sx={{ color:'white', backgroundColor:'#07854E' }}>ESCANEAR</Button>
        )}
        {scanning && (
          <Button onClick={stopScanner} variant="contained" sx={{ color:'#FFFFFF', backgroundColor:'primary.main' }}>DETENER</Button>
        )}
        <Button onClick={handleInfo} variant="contained" sx={{ color:'white', backgroundColor:'secondary.main' }}>Acerca de</Button>
        <Button onClick={handleClear} variant="contained" sx={{ color:'white', backgroundColor:'red' }}>Limpiar</Button>
      </Box>

      {error && <Typography mt={2} color="error">⚠️ {error}</Typography>}

      <Dialog open={openInfo} onClose={()=>setOpenInfo(false)}>
        <DialogTitle sx={{ fontWeight:'bold' }}>Información</DialogTitle>
        <Box p={2}>
          <Typography fontSize={14}>
            Desarrollado por Tecnologías del Tribunal Electoral Departamental de Cochabamba.
            <br/><br/>
          </Typography>
          <Typography fontSize={14}>
            Este sistema permite escanear códigos QR para registrar el acceso a las salas de cómputo.
            <br/>
            Asegúrese de enfocar correctamente el código QR. Si tiene problemas, verifique los permisos de la cámara.
          </Typography>
          <Box mt={2} textAlign="right">
            <Button onClick={()=>setOpenInfo(false)} variant="contained">Cerrar</Button>
          </Box>
        </Box>
      </Dialog>
    </Paper>
  );
};

export default QRScanner;