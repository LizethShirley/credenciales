import * as Yup from 'yup';

export const registerValidation = Yup.object({
  nombres: Yup.string().required('Requerido'),
  apellidoPaterno: Yup.string().required('Requerido'),
  apellidoMaterno: Yup.string().required('Requerido'),
  numeroCarnet: Yup.string()
  .required('Requerido')
  .matches(/^[0-9]+$/, 'Solo números'),
  complemento: Yup.string(),
  expedido: Yup.string().required('Seleccione una opción'),
});
