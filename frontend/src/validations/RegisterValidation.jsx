import * as Yup from "yup";

const registerValidation = Yup.object({
  nombres: Yup.string().required("Campo obligatorio"),
  apellidoPaterno: Yup.string().required("Campo obligatorio"),
  apellidoMaterno: Yup.string(),
  numeroCarnet: Yup.string().required("Campo obligatorio"),
  complemento: Yup.string(),
  numeroCelular: Yup.string()
  .required("Campo obligatorio").matches(/^[67]\d{7}$/, "Número Inválido"),
  secciones: Yup.string().required("Campo obligatorio"),
  cargos: Yup.string().required("Campo obligatorio"),
  codVerificacion: Yup.string().required("Campo obligatorio"),
  imagen: Yup.mixed()
  .required("Campo obligatorio")
  .test("fileType", "Solo se permiten archivos JPG o JPEG", (value) => {
    return value && ["image/jpeg", "image/jpg"].includes(value.type);
  })
  .test("fileSize", "El archivo no debe superar los 2MB", (value) => {
    return value && value.size <= 2 * 1024 * 1024;
  }),

});

export default registerValidation;
