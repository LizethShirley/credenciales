import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, TextField, Autocomplete } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CustomTextField from '../atoms/CustomTextField';

function FormularioObservador({ onSubmit, loading, tipo, onCancel }) {
  const [preview, setPreview] = useState(null);
  const [ciOptions, setCiOptions] = useState([]); // Lista de CIs
  const [loadingCis, setLoadingCis] = useState(false);

  const initialValues = {
    nombre_completo: '',
    ci: '',
    identificador: '',
    organizacion_politica: '',
    foto: null,
  };

  const validationSchema = Yup.object({
    nombre_completo: Yup.string().required('Campo obligatorio'),
    identificador: Yup.string().nullable(),
    organizacion_politica: Yup.string().nullable(),
  });

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('foto', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchCis = async () => {
      try {
        setLoadingCis(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/list/observador-cis/`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setCiOptions(data.cis || []);
        console.log('CIs obtenidos:', data.cis);
      } catch (error) {
        console.error('Error al obtener los CIs:', error);
        setCiOptions([]);
      } finally {
        setLoadingCis(false);
      }
    };
    fetchCis();
  }, []);

  const handleSelectCi = async (value, setFieldValue) => {
    if (!value) return;
    console.log('CI seleccionado:', value);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/observador/${value}`);
      if (!res.ok) throw new Error('No se pudo obtener el observador');
      const data = await res.json();

      setFieldValue('nombre_completo', data.data.nombre_completo || '');
      setFieldValue('ci', data.data.ci || '');
      setFieldValue('identificador', data.data.identificador || '');
      setFieldValue('organizacion_politica', data.data.organizacion_politica || '');
      console.log('Datos del observador cargados:', data.data);
      if (data.data.foto) {
        setPreview(`data:image/jpeg;base64,${data.data.foto}`);
      }
    } catch (error) {
      console.error('Error al obtener observador:', error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values }) => (
        <Form>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6" align="center">
              Registro de Observador
            </Typography>

            <Autocomplete
              freeSolo
              options={ciOptions}
              loading={loadingCis}
              value={values.ci || ''}
              onChange={(e, newValue) => {
                setFieldValue('ci', newValue || '');
                handleSelectCi(newValue, setFieldValue);
              }}
              onInputChange={(e, newInputValue) => {
                // cuando el usuario escribe manualmente
                setFieldValue('ci', newInputValue || '');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="CI"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCis ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <CustomTextField
              name="nombre_completo"
              label="Nombre completo"
              required
              onlyLetters
            />

            {tipo === 'delegado' || tipo === 'candidato' || tipo === 'observador' ? (
              <CustomTextField
                name="organizacion_politica"
                label="Organización Política"
                required
              />
            ) : tipo === 'prensa' ? (
              <CustomTextField
                name="identificador"
                label="Identificador"
                required
              />
            ) : null}

            <Button variant="outlined" component="label">
              Subir Foto
              <input
                type="file"
                name="foto"
                accept="image/*"
                hidden
                onChange={(e) => handleImageChange(e, setFieldValue)}
              />
            </Button>

            {preview && (
              <Box mt={1} display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={1}>
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Botones Registrar y Cancelar */}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                type="button"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}

export default FormularioObservador;