import React, { useEffect, useState } from "react";
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

  if (!pages.length) {
    return <h2 style={{textAlign:'center',marginTop:10}}>No hay credenciales para mostrar.</h2>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 2 }}>
      {/* Estilos para impresión solo del área de credenciales */}
      <style>{`
        @media print {
          body * { visibility: hidden !important;}
          .print-area, .print-area * { visibility: visible !important;}
          .print-area {position: absolute !important; left: 0; top:0;width: 100vw; background: "blue" !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
      <div style={{ width: '100%', maxWidth: 800, display: 'flex', justifyContent: 'flex-end', marginTop: 24, marginRight:54 }}>
        <button
          style={{ padding: '5px 10px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => window.print()}
        >
          Imprimir
        </button>
      </div>
      <div className="print-area" style={{ width: '100%', maxWidth: 800 }}>
        <CredentialPageGroup pages={pages} side={side} cargos={cargos} />
      </div>
    </div>
  );
}
