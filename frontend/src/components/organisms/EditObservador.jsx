// src/components/EditarObservador.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";

function EditObservador({ ci, tipo, token, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    id: "",
    nombre_completo: "",
    ci: "",
    identificador: "",
    organizacion_politica: "",
    foto: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  // Cargar datos del observador
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/observador/${ci}`);
        const data = await res.json();
        setFormData({
          id: data.data.id || "",
          nombre_completo: data.data.nombre_completo || "",
          ci: data.data.ci || "",
          identificador: data.data.identificador || "",
          organizacion_politica: data.data.organizacion_politica || "",
          foto: null,
        });
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setAlert({ open: true, message: "Error al obtener Observador", severity: "error" });
      } finally {
        setFetching(false);
      }
    };

    if (ci) fetchData();
  }, [ci]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = new FormData();
      body.append('id', formData.id);
      body.append('nombre_completo', formData.nombre_completo);
      body.append('ci', formData.ci);
      body.append('identificador', formData.identificador);
      body.append('organizacion_politica', formData.organizacion_politica);
      if (formData.foto) body.append('foto', formData.foto);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/actualizar-observador/${token}`, {
        method: "POST", 
        body,
      });
      const data = await res.json();
      if (data.res === true) {
        onUpdate?.();
        onClose?.();
        setAlert({open: true, message: data.msg, severity: "success"});
      } else {
        alert(data.msg || "Error al actualizar");
        setAlert({ open: true, message: "Error al actualizar Observador", severity: "error" });
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar observador");
      setAlert({ open: true, message: "Error al actualizar observador", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <CircularProgress />;
  return (
    <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
      <Typography variant="h6" align="center">Editar Observador</Typography>

      <TextField
        label="Nombre completo"
        name="nombre_completo"
        value={formData.nombre_completo}
        onChange={handleChange}
        fullWidth
      />

      <TextField
        label="CI"
        name="ci"
        value={formData.ci}
        onChange={handleChange}
        fullWidth
      />

      {tipo === "delegado" || tipo === "candidato" || tipo === "observador" ? (
        <TextField
          label="Organización Política"
          name="organizacion_politica"
          value={formData.organizacion_politica}
          onChange={handleChange}
          fullWidth
        />
      ) : tipo === "prensa" ? (
        <TextField
          label="Identificador"
          name="identificador"
          value={formData.identificador}
          onChange={handleChange}
          fullWidth
        />
      ) : null}

      <Button variant="outlined" component="label">
        Subir Foto
        <input
          type="file"
          name="foto"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </Button>

      {formData.foto && (
        <Typography variant="body2" color="text.secondary">
          Archivo seleccionado: {formData.foto.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading}
      >
        {loading ? "Actualizando..." : "Actualizar"}
      </Button>
    </Box>
  );
}

export default EditObservador;