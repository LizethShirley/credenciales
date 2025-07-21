import { Box, Typography } from "@mui/material";

const CustomCredencialVerde = ({ persona, lado }) => {
  const safePersona = Object.fromEntries(
    Object.entries(persona).map(([key, value]) => [key, value ?? ""])
  );

  return (
    <Box
      className="credencial"
      sx={{
        width: "8.5cm",
        height: "5cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_EVENTUAL_2025.png'
          : '/credenciales/ATRAS_EVENTUAL_2025.png'})`,
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
              width: "4.5cm",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Times New Roman, serif",
              textAlign: "center",
            }}
          >
            
            <Typography
              sx={{
                position: "absolute",
                top: "4.2cm",
                fontWeight: 780,
                fontSize: "6pt",
                fontFamily: "Times New Roman, serif",
              }}
            >
              {safePersona.cargo_nombre}
            </Typography>

            {/* Nombre */}
            <Typography
              sx={{
                position: "absolute",
                top: "3.6cm",
                fontWeight: 780,
                lineHeight: 1,
                fontSize: "6pt",
                fontFamily: "Times New Roman, serif",
              }}
            >
              {safePersona.nombre + " " + safePersona.paterno + " " + safePersona.materno}
            </Typography>

            {/* CI */}
            <Typography
              sx={{
                position: "absolute",
                top: "4cm",
                fontWeight: 780,
                fontSize: "6pt",
                fontFamily: "Times New Roman, serif",
              }}
            >
              {safePersona.ci}
            </Typography>

            {/* Validez */}
            
          </Box>
           <img
              src={`data:image/jpeg;base64,${safePersona.photo}`}
              alt="foto"
              style={{
                position: "absolute",
                top: "1.1cm",
                left: "4.92cm",
                width: "2.5cm",
                height: "2.5cm",
                objectFit: "cover",
              }}
            />
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.22cm",
                    width: "100%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "5pt",
                    color:"white",
                    textAlign:"center",
                    fontFamily: "Times New Roman, serif",
                }}
            >
                {"PERSONAL EVENTUAL"}
            </Typography>
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "0.03cm",
                    width: "100%",
                    lineHeight:"1.3",
                    fontWeight:"700",
                    fontSize: "5pt",
                    color:"white",
                    textAlign:"center",
                    fontFamily: "Times New Roman, serif",
                }}
            >
                {"Elecciones Generales 2025"}
            </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencialVerde;
