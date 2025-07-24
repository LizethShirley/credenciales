import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  MenuList,
  Paper,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function AccesoComputo() {
    const { token } = useParams(); // ← token viene de /accesoComputo/:token
    const [respuesta, setRespuesta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // ← agregado
    const hasCalled = React.useRef(false);
    const [progress, setProgress] = useState(0);

    const speakText = (text) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        if (respuesta?.msg) speakText(respuesta.msg);
    }, [respuesta?.msg]);

    useEffect(() => {
        const timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
        }, 200);
        
        if (token && !hasCalled.current) {
            registrarAcceso(token);
            hasCalled.current = true;
        }
        return () => clearInterval(timer);
    }, [token]);


    const registrarAcceso = async (tokenParam) => {
        setLoading(true);
        setError(null);
        setRespuesta(null);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/registro-acceso/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenParam }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                setError(data.msg || 'Error al registrar acceso');
            } else {
                setRespuesta(data);
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid padding={1} margin={1} height={'95vh'} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Paper elevation={3} style={{borderRadius: '15px', backgroundColor: '#f9f9f9', width: '100%', height: '100%' }}>
                <Typography variant="h5" align="center" style={{ margin: '20px 0', color: '#333' }}>
                    Registro de Acceso 
                </Typography>
                {loading && <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                        position: "absolute",
                        color: "black",
                        }}
                    >
                        {`${progress}%`}
                    </Typography>
                </Box>}
                {error && <Typography variant="body1" align="center" style={{ color: 'red' }}>{error}</Typography>}
                {respuesta && (
                    <Box padding={1} style={{ textAlign: 'center' }}>
                        <Box  marginBottom={1} backgroundColor={respuesta.tipo==="entrada"?'#1AB394':'#F8AC59'} padding={2} borderRadius={3}>
                           <Typography color='#FFFFFF' sx={{ fontWeight: 'bold', letterSpacing: 3 }}>{`${respuesta.personal.nombre  } ${respuesta.personal.paterno} ${respuesta.personal.materno}`}</Typography>
                            <img
                                src={`data:image/jpeg;base64,${respuesta.personal.photo}`}
                                alt="Foto del personal"
                                style={{ width: '150px', borderRadius: '10px', marginTop: '5px' }} 
                            />
                            <Box marginTop={1} display="flex" flexDirection="column" alignItems="center" color='#FFFFFF'>
                                <Typography variant="body1"><strong>CI: </strong>{`${respuesta.personal.ci} ${respuesta.personal.complemento}`}</Typography>
                                <Typography variant="body1">{respuesta.personal.cargo_nombre}</Typography>
                            </Box>
                        </Box>
                        <Grid container spacing={0.5} flexDirection="row" justifyContent="space-between" alignItems="center">
                            <Grid container spacing={0.5} flexDirection="row">
                                <img
                                    src={`/TEDLogo.jpg`}
                                    alt="Logo TED"
                                    style={{ width: '70px', height:'100%'}} 
                                />
                                <Box
                                    backgroundColor="primary.main"
                                    width="1.5px"
                                ></Box>
                                <img
                                    src={`/EleccionesLogo.png`}
                                    alt="Logo TED"
                                    style={{ width: '90px', height:'100%' }} 
                                />
                            </Grid>
                            <Grid container spacing={0.5} flexDirection="row" color='#FFFFFF'>
                                <Box
                                    backgroundColor={respuesta.tipo==="entrada"?'#1AB394':'#F8AC59'}
                                    padding={1}
                                    borderRadius={2}
                                    height="100%"
                                >
                                    <CalendarMonthIcon/>
                                    <Typography variant="body1">{new Date().toLocaleDateString()} </Typography>
                                </Box>
                                <Box
                                    backgroundColor={respuesta.tipo==="entrada"?'#1AB394':'#F8AC59'}
                                    padding={1}
                                    borderRadius={2}
                                    height="100%"
                                >
                                    <AccessAlarmsIcon/>
                                    <Typography variant="body1">{new Date().toLocaleTimeString()} </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Paper>
           {/* <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Registro de Acceso</h2>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {respuesta && (
                <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                    <h3 style={{ color: 'green' }}>{respuesta.msg}</h3>
                    <p><strong>Tipo de acceso:</strong> {respuesta.tipo}</p>

                    <h4>Datos del Personal</h4>
                    <p><strong>Nombre:</strong> {`${respuesta.personal.nombre} ${respuesta.personal.paterno} ${respuesta.personal.materno}`}</p>
                    <p><strong>CI:</strong> {`${respuesta.personal.ci} ${respuesta.personal.complemento}`}</p>
                    <p><strong>Cargo:</strong> {respuesta.personal.cargo_nombre}</p>
                    <p><strong>Sección:</strong> {respuesta.personal.seccion_nombre}</p>

                    {respuesta.personal.photo && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Foto:</strong><br />
                            <img
                                src={`data:image/jpeg;base64,${respuesta.personal.photo}`}
                                alt="Foto del personal"
                                style={{ width: '150px', borderRadius: '10px', marginTop: '5px' }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div> */}
        </Grid>
    );
}

export default AccesoComputo;
