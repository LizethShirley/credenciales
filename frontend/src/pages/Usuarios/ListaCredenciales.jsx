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

const ListaCredenciales = () => {
    const [filtro, setFiltro] = useState('');
    const [personal, setPersonal] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
        prev.includes(id)
            ? prev.filter(item => item !== id)
            : [...prev, id]
    );
};


    const columnas = [
        {
            id: 'photo',
            label: 'Foto',
            width: 60,
            render: (row) =>
                row.photo ? (
                    <img
                        src={`data:image/jpeg;base64,${row.photo}`}
                        alt="foto"
                        width={40}
                        height={40}
                        style={{ borderRadius: '50%' }}
                    />
                ) : (
                    'Sin foto'
                )
        },
        { id: 'nombre', label: 'Nombre', width: 150 },
        { id: 'paterno', label: 'Apellido Paterno', width: 150 },
        { id: 'materno', label: 'Apellido Materno', width: 150 },
        { id: 'ci', label: 'CI', width: 100 },
        { id: 'cargo_nombre', label: 'Cargo', width: 150 },
        { id: 'seccion_nombre', label: 'Sección', width: 150 },
        { id: 'recinto_nombre', label: 'Recinto', width: 180 },
        {
            id: 'opciones',
            label: 'Opciones',
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <CustomEditIcon onClick={() => console.log("Editar", row)} />
                    <CustomDeleteIcon onClick={() => console.log("Eliminar", row)} />
                </Box>
            )
        }
    ];

    useEffect(() => {
        obtenerPersonal();
    }, []);

    const obtenerPersonal = async () => {
        try {
            const date1 = '2025-07-01';
            const date2 = '2025-07-31';
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
                    <CustomTable
                        columns={columnas}
                        rows={personalFiltrado}
                        onClickRow={(row) => console.log("Fila seleccionada:", row)}
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default ListaCredenciales;
