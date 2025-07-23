import React, { useState } from "react";
import CustomAddIcon from "../../components/atoms/CustomAddIcon";
import CustomModal from "../../components/molecules/CustomModal";

const AddUnidadModalWrapper = ({ onSuccess }) => {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/secciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errores de validación backend:", errorData);

        if (errorData.errors) {
          const mensajes = Object.values(errorData.errors)
            .flat()
            .join("\n");
          alert("Errores:\n" + mensajes);
        } else {
          alert("Error: " + errorData.message);
        }
        return;
      }

      const data = await response.json();
      console.log("Unidad guardada:", data);

      if (typeof onSuccess === "function") {
        onSuccess(data.seccion); // ✅ solo enviamos la unidad creada
      }
      alert("Unidad guardada exitosamente", data.seccion);
      setOpen(false);

      handleClose();
    } catch (error) {
      console.error("Error guardando unidad:", error);
      alert("Error guardando unidad, revisa la consola");
    }
  };

  return (
    <>
      <CustomAddIcon onClick={handleOpen} />
      <CustomModal
        title="Añadir Unidad"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddUnidadModalWrapper;
