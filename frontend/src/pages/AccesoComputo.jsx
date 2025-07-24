import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AccesoComputo() {
    const { token } = useParams(); // ← token viene de /accesoComputo/:token
    const [respuesta, setRespuesta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // ← agregado

    useEffect(() => {
        if (token) {
            registrarAcceso(token);
        }
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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        </div>
    );
}

export default AccesoComputo;
