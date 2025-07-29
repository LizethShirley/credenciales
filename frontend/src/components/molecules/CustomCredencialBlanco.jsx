import { Box, Typography } from "@mui/material";

const CustomCredencialBlanco = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "5cm",
        height: "8cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_JUEZELECTORAL_EG2025.jpg'
          : '/credenciales/ATRAS_JUEZELECTORAL_EG2025.jpg'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        fontFamily: "Times New Roman, serif",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "5.2cm",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Times New Roman, serif",
              textAlign: "center",
            }}
          >

            {/* Nombre */}
            <Typography
              fontWeight="800"
              sx={{
                position: "absolute",
                top: "6.2cm",
                lineHeight: 1,
                fontSize: "5.7pt",
                fontFamily: "Source Sans Pro, sans-serif",
              }}
            >
              {safePersona.nombre + " " + safePersona.paterno + " " + safePersona.materno}
            </Typography>

            {/* CI */}
            <Typography
              sx={{
                position: "absolute",
                top: "6.4cm",
                fontWeight: 800,
                fontSize: "6pt",
                fontFamily: "Source Sans Pro, sans-serif",
              }}
            >
              {"CI: "+safePersona.ci}
            </Typography>

            {/* Validez */}
            
          </Box>
           <img
              src={`data:image/jpeg;base64,${safePersona.photo}`}
              alt="foto"
              style={{
                position: "absolute",
                top: "1.95cm",
                left: "1.21cm",
                width: "2.55cm",
                height: "2.55cm",
                objectFit: "cover",
              }}
            />
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.02cm",
                    width: "100%",
                    fontWeight:"700",
                    fontSize: "6pt",
                    color:"#000000",
                    textAlign:"center",
                    fontFamily: "Source Sans Pro, sans-serif",
                }}
            >
                {"ELECCIONES GENERALES 2025"}
            </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialBlanco;
