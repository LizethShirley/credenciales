import { Box, Typography } from "@mui/material";

const CustomCredencial = ({ persona, lado }) => {
  return (
    <Box
      className="credencial"
      sx={{
        width: "5.5cm",
        height: "8cm",
        position: "relative",
        backgroundImage: `url(${lado === 'anverso' 
          ? '/credenciales/CARA_EVENTUAL_EG2020_4.png'
          : '/credenciales/ATRAS_EVENTUAL_EG2020_4.png'})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: "8pt",
        overflow: "hidden"
      }}
    >
      {lado === 'anverso' && (
        <>
          <img
            src={persona.foto}
            alt="foto"
            style={{
              position: "absolute",
              top: "2.9cm",
              left: "1.6cm",
              width: "2cm",
              height: "2cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: "0.6cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt"
            }}
          >
            {persona.nombre}
          </Typography>
          <Typography
            sx={{
              position: "absolute",
              bottom: "0.2cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt"
            }}
          >
            CI: {persona.ci}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencial;
