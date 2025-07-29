import React from "react";
import { Grid } from "@mui/material";
import CustomCredencial from "../molecules/CustomCredencial";
import CustomCredencialVerde from "../molecules/CustomCredencialVerde";
import CustomCredencialQR from "../molecules/CustomCredencialQR";
import CustomCredencialBlanco from "../molecules/CustomCredencialBlanco";

export default function CredentialSheet({ persons, side, cargos = [], accesoComputo }) {
  const getComponentePorColor = (persona) => {
    const cargoPersona = cargos.find(c => c.id === persona.cargo_id);
    const color = cargoPersona?.color?.toLowerCase();

    if (color === "verde" && accesoComputo === 0) {
      return <CustomCredencialVerde persona={persona} lado={side} />;
    }else if (accesoComputo === 1) {
      return <CustomCredencialQR persona={persona} lado={side} />
    }else if(accesoComputo === 0 && color === "blanco") {
      return <CustomCredencialBlanco persona={persona} lado={side} />;
    }// }else if(accesoComputo === 0 && color === "verde") {
    //   return <CustomCredencial persona={persona} lado={side} />;
    // }else if(accesoComputo === 0 && color === "verde") {
    //   return <CustomCredencial persona={persona} lado={side} />;
    // }else if(accesoComputo === 0 && color === "verde") {
    //   return <CustomCredencial persona={persona} lado={side} />;
    // }else if(accesoComputo === 0 && color != "verde") {
    //   return <CustomCredencial persona={persona} lado={side} />;
    // }
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {persons.map((p, idx) => (
        <Grid
          item
          xs={4}
          key={p.id || idx}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {getComponentePorColor(p)}
        </Grid>
      ))}
    </Grid>
  );
}
