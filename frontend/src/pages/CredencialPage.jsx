import React, { useState } from "react";
import CredentialPrintPage from "../components/molecules/CredentialPrintPage";


const CredencialesPage = () => {
  const [data, setData] = useState([]);

  const fetchData = async (inicio, fin,cargo, circunscripcion) => {
    try {
      const queryParams = new URLSearchParams({ inicio, fin, cargo, circunscripcion }).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/list/personal-filter?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      setData(result.personal);
      return result;
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  return <CredentialPrintPage data={data} fetchData={fetchData} />;
};

export default CredencialesPage;

  


