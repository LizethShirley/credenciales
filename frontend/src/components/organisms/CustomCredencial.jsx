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
          <Typography
            sx={{
              position: "absolute",
              top: "2.7cm",
              left: 0,
              width: "100%",
              textAlign: "center",
              fontSize: "8pt"
            }}
          >
            {persona.cargo}
          </Typography>
          <img
            src={persona.foto}
            alt="foto"
            style={{
              position: "absolute",
              top: "3.1cm",
              left: "1.7cm",
              width: "1.9cm",
              height: "1.9cm",
              objectFit: "cover"
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              bottom: "2.6cm",
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
              bottom: "0.52cm",
              left: "4.25cm",
              width: "100%",
              fontSize: "7pt"
            }}
          >
            {persona.ci}
          </Typography>
        </>
      )}
      {lado === 'reverso' && (
        <>
          <Typography
            sx={{
              position: "absolute",
              top: "2.6cm",
              left: "1.6cm",
              width: "100%",
              fontSize: "8pt"
            }}
          >
            {persona.cargo}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default CustomCredencial;
