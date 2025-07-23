import React, { useState } from "react";
import CustomEditIcon from "../../components/atoms/CustomEditIcon";
import CustomModal from "../../components/molecules/CustomModal";

const EditUnidadModal = ({ unidad, onSuccess }) => {
  const [open, setOpen] = useState(false);

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
    { name: "abreviatura", label: "Abreviatura", required: true },
    {
      name: "estado",
      label: "Estado",
      required: true,
      options: [
        { value: 1, label: "Habilitado" },
        { value: 0, label: "Inhabilitado" },
      ],
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/secciones/${unidad.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Errores de validación backend:", data);
        if (data.errors) {
          const mensajes = Object.values(data.errors).flat().join("\n");
          alert("Errores:\n" + mensajes);
        } else {
          alert("Error: " + data.message);
        }
        return;
      }

      if (typeof onSuccess === "function") {
        onSuccess(data.seccion);
      }

      alert("Unidad actualizada exitosamente");
      handleClose();
    } catch (error) {
      console.error("Error actualizando unidad:", error);
      alert("Error actualizando unidad");
    }
  };

  return (
    <>
      <CustomEditIcon onClick={handleOpen} />
      <CustomModal
        title="Editar Unidad"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={unidad}
      />
    </>
  );
};

export default EditUnidadModal;
