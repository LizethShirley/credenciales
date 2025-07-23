import React, { useState } from "react";
import CustomModal from "../molecules/CustomModal";
import { IconButton } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const CustomFormCargo = ({ idseccion }) => {
  const [open, setOpen] = useState(false);

  const fields = [
    { name: "nombre", label: "Nombre", required: true, onlyLetters: true },
    {
      name: "estado",
      label: "Estado",
      required: true,
      options: [
        { value: "habilitado", label: "Habilitado" },
        { value: "deshabilitado", label: "Inhabilitado" },
      ],
    },
    {
      name: "color",
      label: "Color",
      required: true,
      options: [
        { value: "verde", label: "Verde" },
        { value: "plomo", label: "Plomo" },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    try {
      const data = new FormData();
      data.append("nombre", values.nombre);
      data.append("estado", values.estado === "habilitado" ? 1 : 0);
      data.append("color", values.color);
      data.append("idseccion", idseccion);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/cargos`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert("¡Registro exitoso!");
        setOpen(false);
      } else {
        alert("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con la API");
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <GroupAddIcon />
      </IconButton>
      <CustomModal
        title="Registrar nuevo cargo"
        fields={fields}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default CustomFormCargo;
