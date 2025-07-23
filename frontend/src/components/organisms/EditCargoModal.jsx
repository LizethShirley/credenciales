import React, { useState } from "react";
import CustomEditIcon from "../../components/atoms/CustomEditIcon";
import CustomModal from "../../components/molecules/CustomModal";

const EditCargoModal = ({ cargo, onSuccess }) => {
  const [open, setOpen] = useState(false);

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
    {
      name: "color",
      label: "Color",
      required: true,
      options: [
        { value: "verde", label: "Verde" },
        { value: "plomo", label: "Plomo" },
      ],
    },
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
      const valoresConSeccion = {
        ...values,
        idseccion: cargo.idseccion, 
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cargos/${cargo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(valoresConSeccion), 
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

      alert("Cargo actualizado exitosamente");
      handleClose();
    } catch (error) {
      console.error("Error actualizando cargo:", error);
      alert("Error actualizando cargo");
    }
  };


  return (
    <>
      <CustomEditIcon onClick={handleOpen} />
      <CustomModal
        title="Editar Cargo"
        fields={fields}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialValues={cargo}
      />
    </>
  );
};

export default EditCargoModal;
