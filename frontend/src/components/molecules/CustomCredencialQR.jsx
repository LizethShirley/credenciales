import { Box, Typography } from "@mui/material";

const CustomCredencialQR = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "6cm",
        height: "9.5cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_QR_EG2025.png'
          : '/credenciales/ATRAS_QR_EG2025.jpg'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
        <>
          <Typography
            sx={{
              position: "absolute",
              lineHeight:"1",
              top: "2.9cm",
              left: 0,
              width: "100%",
              fontWeight:780,
              textAlign: "center",
              fontSize: "6pt"
            }}
          >
            {safePersona.cargo_nombre}
          </Typography>
          <img
            src={`data:image/svg+xml;base64,${safePersona.qr}`}
            alt="QR"
            style={{
              position: "absolute",
              top: "3.2cm",
              left: "1.8cm",
              width: "2.6cm",
              height: "2.6cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "6.6cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt",
              lineHeight: 1
            }}
          >
            {safePersona.nombre+" "+safePersona.paterno+" "+safePersona.materno}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "1.88cm",
              left: "3.5cm",
              width: "100%",
              fontSize: "7pt"
            }}
          >
            {safePersona.ci}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "0",
              height: "0.45cm",
              textAlign: "center",
              width: "100%",
              fontWeight:"700",
              fontSize: "6pt",
              color:"white",
              bgcolor: "#000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
            }}
          >
            {"Válido Elecciones Generales 2025"}
          </Typography>
        </>
      )}
      {lado === 'reverso' && (
        <Typography
          sx={{
            position: "absolute",
            bottom: "0.7cm",
            width: "100%",
            textAlign: "center",
            fontSize: "8pt",
            lineHeight: 1
          }}
        >
          {"Aqui va el qr horizontal"}
        </Typography>
      )}
    </Box>
  );
};

export default CustomCredencialQR;
