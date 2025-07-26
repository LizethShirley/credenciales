import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import CredentialPageGroup from "../components/organisms/CredenctialPageGroup";

export default function PreviewCredenciales() {
  const [pages, setPages] = useState([]);
  const [side, setSide] = useState("anverso");
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    const storedPages = localStorage.getItem("credenciales_preview_pages");
    const storedSide = localStorage.getItem("credenciales_preview_side");
    if (storedPages) setPages(JSON.parse(storedPages));
    if (storedSide) setSide(storedSide);
  }, []);

  useEffect(() => {
    const fetchCargos = async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/list/cargos`);
        if (!resp.ok) throw new Error("Error al obtener cargos");
        const data = await resp.json();
        setCargos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCargos();
  }, []);

  const handlePrint = () => {
    window.print();
    // Cerramos la ventana DESPUÉS de imprimir
    setTimeout(() => {
      window.close();
    }, 500);
  };

  if (!pages.length) {
    return <h2 style={{ textAlign: "center", marginTop: 10 }}>No hay credenciales para mostrar.</h2>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 2,
      }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .print-area, .print-area * { visibility: visible !important; }
          .print-area {
            position: absolute !important;
            left: 0; top: 0;
            width: 100vw;
            background: white !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: 800, display: "flex", justifyContent: "flex-end", marginTop: 24, marginRight: 54 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            paddingX: 2,
            paddingY: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "3px 3px 6px #c1c1c1",
            "&:hover": {
              boxShadow: "4px 4px 8px #b0b0b0",
            },
          }}
        >
          Imprimir
        </Button>
      </div>

      <div className="print-area" style={{ width: "100%", maxWidth: 800 }}>
        <CredentialPageGroup pages={pages} side={side} cargos={cargos} />
      </div>
    </div>
  );
}