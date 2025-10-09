// src/components/EditarObservador.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextField from "../atoms/CustomTextField";

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
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required("Campo obligatorio"),
    ci: Yup.string().required("Campo obligatorio"),
    identificador: Yup.string().nullable(),
    organizacion_politica: Yup.string().nullable(),
    foto: Yup.mixed().nullable(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/observador/${ci}`);
        const data = await res.json();
        const observador = data.data;

        setFormData({
          id: observador.id || "",
          nombre_completo: observador.nombre_completo || "",
          ci: observador.ci || "",
          identificador: observador.identificador || "",
          organizacion_politica: observador.organizacion_politica || "",
          foto: null,
        });
        if (observador.foto) {
          if (typeof observador.foto === "string") {
            const base64String = observador.foto.startsWith("data:")
              ? observador.foto 
              : `data:image/jpeg;base64,${observador.foto}`;
            setPreview(base64String);
          }
          else if (Array.isArray(observador.foto)) {
            const byteArray = new Uint8Array(observador.foto);
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            const url = URL.createObjectURL(blob);
            setPreview(url);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setFetching(false);
      }
    };

    if (ci) fetchData();
  }, [ci]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const body = new FormData();
      body.append("id", formData.id);
      body.append("nombre_completo", values.nombre_completo);
      body.append("ci", values.ci);
      body.append("identificador", values.identificador);
      body.append("organizacion_politica", values.organizacion_politica);
      if (values.foto) body.append("foto", values.foto);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/actualizar-observador/${token}`,
        {
          method: "POST",
          body,
        }
      );

      const data = await res.json();
      if (data.res === true) {
        onUpdate?.();
        onClose?.();
      } else {
        alert(data.msg || "Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar observador");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <CircularProgress />;

  return (
    <Formik
      enableReinitialize 
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, isSubmitting, values }) => (
        <Form>
          <Typography variant="h6" align="center" gutterBottom>
            Editar Observador
          </Typography>

          <CustomTextField name="nombre_completo" label="Nombre completo" />
          <CustomTextField name="ci" label="CI" />

          {tipo === "delegado" || tipo === "candidato" || tipo === "observador" ? (
            <CustomTextField
              name="organizacion_politica"
              label="Organización Política"
            />
          ) : tipo === "prensa" ? (
            <CustomTextField name="identificador" label="Identificador" />
          ) : null}

          <Button variant="outlined" component="label">
            Subir Foto
            <input
              type="file"
              name="foto"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setFieldValue("foto", file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </Button>

          {preview && (
            <Box mt={2} style={{ textAlign: "center" }}>
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", maxWidth: 120, borderRadius: 8 }}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting || loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
            <Button variant="outlined" color="secondary" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default EditObservador;