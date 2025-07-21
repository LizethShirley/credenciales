import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';

import CustomTable from '../../components/organisms/CustomTable';
import CustomEditIcon from '../../components/atoms/CustomEditIcon';
import CustomDeleteIcon from '../../components/atoms/CustomDeleteIcon';
import CredencialesTable from '../../components/organisms/CredencialesTable';

const ListaCredenciales = () => {
    const [filtro, setFiltro] = useState('');
    const [personal, setPersonal] = useState([]);

    useEffect(() => {
        obtenerPersonal();
    }, []);

    const obtenerPersonal = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal`);
            const data = await response.json();
            setPersonal(data.personal);
        } catch (error) {
            console.error("Error al obtener personal:", error);
        }
    };

    const personalFiltrado = personal.filter((item) => {
        const texto = filtro.toLowerCase();
        return (
            item.nombre?.toLowerCase().includes(texto) ||
            item.paterno?.toLowerCase().includes(texto) ||
            item.materno?.toLowerCase().includes(texto) ||
            item.ci?.toLowerCase().includes(texto) ||
            item.cargo_nombre?.toLowerCase().includes(texto) ||
            item.seccion_nombre?.toLowerCase().includes(texto)
        );
    });

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ width: '100%', maxWidth: 1010 }}>
                <Typography variant="h5" align="center">Lista de Personal</Typography>
                <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <TextField
                        label="Buscar..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        size="small"
                        sx={{ width: 300 }}
                    />
                </Box>
                <Paper sx={{ p: 2 }}>
                    <CredencialesTable data={personalFiltrado} onDeleteSuccess={obtenerPersonal} />
                </Paper>
            </Box>
        </Box>
    );
};

export default ListaCredenciales;
