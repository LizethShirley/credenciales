

import React, {useState} from "react";
import CredentialPrintPage from "../components/molecules/CredentialPrintPage";

// ----------------- Mock API -----------------
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Creamos el mock con retraso de 500 ms para simular red
const mock = new MockAdapter(axios, { delayResponse: 500 });

// Datos simulados de personal
const personalData = [
  {
    id: 1,
    nombre: "Juan Pérez",
    unidad: "Administración",
    cargo: "Acceso a lugar de Computo",
    ci: "9466586",
    created_at: "2025-07-05",
    foto: "/foto.jpg",
  },
  {
    id: 2,
    nombre: "María Gómez",
    unidad: "Recursos Humanos",
    cargo: "Jefa",
    ci: "9466586",
    created_at: "2025-07-07",
    foto: "/foto.jpg",
  },
  {
    id: 3,
    nombre: "Carlos López",
    unidad: "Sistemas",
    cargo: "Desarrollador",
    ci: "9466586",
    created_at: "2025-07-10",
    foto: "/foto.jpg",
  },
];

mock.onGet("/api/unidad").reply((config) => {
  const params = config.params || {};
  const { fecha_inicio, fecha_fin } = params;

  let filteredData = personalData;

  if (fecha_inicio && fecha_fin) {
    filteredData = personalData.filter(
      (p) => p.created_at >= fecha_inicio && p.created_at <= fecha_fin
    );
  }

  return [200, filteredData];
});
const CredencialesPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async (fecha_inicio, fecha_fin) => {
    try {
      const res = await axios.get("/api/unidad", {
        params: { fecha_inicio, fecha_fin },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  return <CredentialPrintPage data={data} fetchData={fetchData} />;
};

export default CredencialesPage;
