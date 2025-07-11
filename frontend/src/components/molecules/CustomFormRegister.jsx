import React, {useState} from 'react';
import { Grid, Button} from '@mui/material';
import { Formik, Form } from 'formik';
import CustomTextField from '../atoms/CustomTextField';
import CustomSelect from '../atoms/CustomSelect';
import { registerValidation } from '../../validations/RegisterValidation';
import CustomUploadImage from '../atoms/CustomUploadImage';

const CustomFormRegister = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const initialValues = {
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    numeroCarnet: '',
    complemento: '',
    expedido: '',
    numeroCelular: '',
  };

  const opcionesExpedido = [
    { value: 'LP', label: 'La Paz' },
    { value: 'CB', label: 'Cochabamba' },
    { value: 'SC', label: 'Santa Cruz' },
    { value: 'OR', label: 'Oruro' },
    { value: 'PT', label: 'Potosí' },
    { value: 'CH', label: 'Chuquisaca' },
    { value: 'TJ', label: 'Tarija' },
    { value: 'BN', label: 'Beni' },
    { value: 'PD', label: 'Pando' },
  ];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerValidation}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form>
        <Grid container spacing={10} direction="row">
          <Grid container spacing={1} direction="column">
          <Grid item>
            <CustomTextField name="nombres" label="Nombres" onlyLetters required />
          </Grid>

          <Grid container item spacing={4}>
            <Grid item xs={12} sm={6}>
              <CustomTextField name="apellidoPaterno" label="Apellido Paterno" onlyLetters />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField name="apellidoMaterno" label="Apellido Materno" onlyLetters />
            </Grid>
          </Grid>

          <Grid container item spacing={4} minWidth='100%'>
            <Grid item width={150} xs={12} sm={4}>
              <CustomTextField name="numeroCarnet" label="Número de Carnet" onlyNumbers required />
            </Grid>
            <Grid item width={100} xs={12} sm={4}>
              <CustomTextField  name="complemento" label="Complemento" onlyLetters />
            </Grid>
            <Grid item width={165} xs={12} sm={4}>
              <CustomSelect name="expedido" label="Expedido" options={opcionesExpedido} required />
            </Grid>
          </Grid>

          <Grid item>
            <CustomTextField name="numeroCelular" label="Celular (Whatsapp)" onlyNumbers required />
          </Grid>
        </Grid>
        <Grid container spacing={1} direction="column">
          
          <Grid item>
            <CustomTextField name="codVerificacion" label="Código de verificación" onlyNumbers required />
          </Grid>
          <Grid>
            <CustomUploadImage
              label="Clic para Subir Imagen"
              required
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Registrar
            </Button>
          </Grid>
        </Grid>
        </Grid>
      </Form>
    </Formik>
  );
};

export default CustomFormRegister;
