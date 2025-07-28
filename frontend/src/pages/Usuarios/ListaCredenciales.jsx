import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    IconButton
} from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

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
            setPersonal(data.personal);
        } catch (error) {
            console.error("Error al obtener personal:", error);
        }
    };

    const personalFiltrado = personal
        .filter((item) => {
            const nombreCompleto = `${item.nombre || ''} ${item.paterno || ''} ${item.materno || ''}`.toLowerCase();
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

    const toggleOrden = () => setOrdenAsc(!ordenAsc);

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

                <CredencialesTable data={personalFiltrado} onDeleteSuccess={obtenerPersonal} />
            </Box>
        </Box>
    );
};

export default ListaCredenciales;
