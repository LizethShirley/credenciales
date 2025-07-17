import React from "react";
import { Grid } from "@mui/material";
import CustomCredencial from "../molecules/CustomCredencial";

export default function CredentialSheet({ persons, side }) {
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
          <CustomCredencial persona={p} lado={side} />
        </Grid>
      ))}
    </Grid>
  );
}
