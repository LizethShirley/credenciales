import React, { useState, useEffect } from "react";
import { Grid, Button, Box, Typography } from "@mui/material";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";

import CustomTextField from "../atoms/CustomTextField";
import CustomSelect from "../atoms/CustomSelect";
import CustomUploadImage from "../atoms/CustomUploadImage";
import WarningIcon from "@mui/icons-material/Warning";

/* ▸ Si ya tienes un esquema aparte, importa el tuyo en lugar de este.   */
/* ▸ Lo incluyo aquí para que puedas compilar sin archivos extra.        */
const registerValidation = Yup.object({
  nombres: Yup.string().required("Campo obligatorio"),
  apellidoPaterno: Yup.string().required("Campo obligatorio"),
  apellidoMaterno: Yup.string(),
  numeroCarnet: Yup.string().required("Campo obligatorio"),
  complemento: Yup.string(),
  expedido: Yup.string().required("Campo obligatorio"),
  numeroCelular: Yup.string().required("Campo obligatorio"),
  secciones: Yup.string().required("Campo obligatorio"),
  cargos: Yup.string().required("Campo obligatorio"),
  codVerificacion: Yup.string().required("Campo obligatorio"),
  imagen: Yup.mixed().required("Campo obligatorio"),
});

const SeccionListener = ({ setListCargos }) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const obtenerCargos = async () => {
      if (!values.secciones) {
        setListCargos([]);
        setFieldValue("cargos", "");
        return;
      }

      try {
        const resp = await fetch(
          `http://127.0.0.1:8000/api/secciones/secciones-cargos/${values.secciones}`
        );
        if (!resp.ok) throw new Error("Error al obtener cargos");

        const data = await resp.json();
        const cargos = data.data?.cargos ?? [];

        const opciones = cargos.map((cargo) => ({
          value: cargo.id_cargo,
          label: cargo.nombre_cargo,
        }));

        setListCargos(opciones);

        if (!opciones.find((op) => op.value === values.cargos)) {
          setFieldValue("cargos", "");
        }
      } catch (error) {
        console.error("Error al obtener cargos:", error);
        setListCargos([]);
        setFieldValue("cargos", "");
      }
    };

    obtenerCargos();
  }, [values.secciones]);

  return null;
};

const CustomFormRegister = () => {
  const [listSecciones, setListSecciones] = useState([]);
  const [listCargos, setListCargos] = useState([]);

  useEffect(() => {
    const obtenerListaUnidad = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_API_URL}/list/secciones`
        );
        if (!resp.ok) throw new Error("Error al obtener secciones");

        const data = await resp.json();
        const opciones = data.map((item) => ({
          value: item.id,
          label: item.nombre,
        }));
        setListSecciones(opciones);
      } catch (err) {
        console.error(err);
      }
    };

    obtenerListaUnidad();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
  try {
    const formData = new FormData();

    // Añadir campos texto uno por uno
    formData.append("nombres", values.nombres);
    formData.append("paterno", values.apellidoPaterno);
    formData.append("materno", values.apellidoMaterno);
    formData.append("ci", values.numeroCarnet);
    formData.append("complemento", values.complemento);
    formData.append("extencion", values.expedido);
    formData.append("celular", values.numeroCelular);
    formData.append("id_cargo", values.cargos);
    formData.append("token", values.codVerificacion);
    formData.append("id_recinto", null);
    formData.append("estado", 0);
    formData.append("accesoComputo", 0);

    if (values.imagen) {
      formData.append("photo", values.imagen);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/personal`, {
      method: "POST",
      headers:{
        'Content-Type': 'aplication/json'
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Registro exitoso");
      resetForm(); 
    } else {
      console.error("Error de servidor:", result);
      alert("❌ Error al guardar");
    }
  } catch (error) {
    console.error("Error al enviar datos:", error);
    alert("❌ Error de conexión con la API");
  }
};


  const initialValues = {
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    numeroCarnet: "",
    complemento: "",
    expedido: "",
    numeroCelular: "",

    secciones: "",
    cargos: "",

    codVerificacion: "",
    imagen: null,
  };

  const opcionesExpedido = [
    { value: "LP", label: "La Paz" },
    { value: "CB", label: "Cochabamba" },
    { value: "SC", label: "Santa Cruz" },
    { value: "OR", label: "Oruro" },
    { value: "PT", label: "Potosí" },
    { value: "CH", label: "Chuquisaca" },
    { value: "TJ", label: "Tarija" },
    { value: "BN", label: "Beni" },
    { value: "PD", label: "Pando" },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidation}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <SeccionListener setListCargos={setListCargos} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomSelect
                label="Secciones"
                name="secciones"
                options={listSecciones}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomSelect
                label="Cargo"
                name="cargos"
                options={listCargos}
                required
                disabled={!values.secciones}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField name="nombres" label="Nombres" onlyLetters required />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="apellidoPaterno"
                label="Apellido Paterno"
                onlyLetters
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="apellidoMaterno"
                label="Apellido Materno"
                onlyLetters
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField
                name="numeroCarnet"
                label="Número de Carnet"
                onlyNumbers
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField name="complemento" label="Complemento" onlyLetters />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomSelect
                name="expedido"
                label="Expedido"
                options={opcionesExpedido}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="numeroCelular"
                label="Celular (Whatsapp)"
                onlyNumbers
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  bgcolor: "#FCF8E3",
                  border: "2px solid #FAD17F",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                }}
              >
                <WarningIcon sx={{ color: "#FFAA00" }} />
                <Typography fontSize="0.9rem" color="#F8A500">
                  La imagen debe ser 4x4 cm, fondo blanco, sin sombreros ni lentes.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomUploadImage
                name="imagen"
                label="Clic para subir imagen"
                selectedFile={values.imagen}
                handleFileChange={(e) => {
                  const file = e.target.files[0];
                  setFieldValue("imagen", file);
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                name="codVerificacion"
                label="Código de verificación"
                onlyNumbers
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  borderRadius: 2,
                  bgcolor: "#B6E4FC",
                  border: "2px solid #5FC7FC",
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                }}
              >
                <WarningIcon sx={{ color: "#24B1F8" }} />
                <Typography fontSize="0.95rem" color="#24B1F8">
                  Nota: si desea actualizar datos de su registro debe volver a
                  registrarse.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Registrar
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default CustomFormRegister;
