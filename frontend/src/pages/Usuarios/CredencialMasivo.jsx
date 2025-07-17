import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const CredencialMasivo = () => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Mi Documento",
    onAfterPrint: () => alert("✅ Impresión completada"),
    onBeforePrint: () => console.log("🖨 Preparando impresión..."),
  });

  return (
    <>
      <button onClick={handlePrint}>🖨 Imprimir</button>

      {/* El contenido que quieres imprimir debe estar visible o desplazado fuera de pantalla */}
      <div
        ref={printRef}
        style={{
          position: "absolute",
          left: "-9999px", // Oculto fuera de pantalla, pero imprimible
        }}
      >
        <div style={{ width: "21cm", height: "29.7cm", padding: "2cm", background: "white" }}>
          <h1 style={{ textAlign: "center" }}>Documento de Prueba</h1>
          <p>Este es un contenido que será enviado a impresión.</p>
          <p>👤 Nombre: Juan Pérez</p>
          <p>🆔 Carnet: 12345678</p>
          <p>🗓 Fecha: 17/07/2025</p>
        </div>
      </div>
    </>
  );
};

export default CredencialMasivo;
