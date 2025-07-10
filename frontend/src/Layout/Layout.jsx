// src/Layout/Layout.jsx
import NavBar from "../components/NavBar";
import LateralBar from "../components/LateralBar";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";

const anchoCaja = 200;

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', width:'100%' }}>
      <NavBar anchoCaja={anchoCaja} />
      <LateralBar anchoCaja={anchoCaja} />
      <Box component="main" sx={{ flexGrow: 1, p: 2.5, mt: 2.5 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
