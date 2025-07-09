// src/Layout/Layout.jsx
import NavBar from "../components/NavBar";
import LateralBar from "../components/LateralBar";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";

const anchoCaja = 200;

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <NavBar anchoCaja={anchoCaja} />
      <LateralBar anchoCaja={anchoCaja} />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 4 }}>
        <Toolbar />
        <Outlet /> {/* Aquí se muestran los hijos, como Inicio */}
      </Box>
    </Box>
  );
};

export default Layout;
