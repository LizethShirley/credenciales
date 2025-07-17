import React, { useState, useContext } from "react";
import { LateralBarContext } from "../Layout/Layout";
import CredentialPrintPage from "../components/molecules/CredentialPrintPageV1";


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

  // Usar el contexto para saber si el lateralBar está abierto
  const { lateralOpen } = useContext(LateralBarContext);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: lateralOpen ? 'flex-end' : 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingRight: lateralOpen ? 20 : 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200 }}>
        <CredentialPrintPage data={data} fetchData={fetchData} />
      </div>
    </div>
  );
};

export default CredencialesPage;

  


