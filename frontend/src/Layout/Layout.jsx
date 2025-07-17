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
      {/* <LateralBar anchoCaja={anchoCaja} /> */}
      <Box sx={{ flexGrow: 1, ml: 2.5, mt: 3}}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
