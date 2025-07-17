import NavBar from "../components/NavBar";
import LateralBar from "../components/LateralBar";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { useState, createContext } from "react";

export const LateralBarContext = createContext({ lateralOpen: true });

const anchoCaja = 200;

const Layout = () => {
  const [lateralOpen, setLateralOpen] = useState(true);

  return (
    <LateralBarContext.Provider value={{ lateralOpen, setLateralOpen }}>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <NavBar anchoCaja={anchoCaja} />
        <LateralBar anchoCaja={anchoCaja} open={lateralOpen} setOpen={setLateralOpen} />

        <Box
          sx={{
            flexGrow: 1,
            mt: 3,
            ml: lateralOpen ? `${anchoCaja}px` : '0px', // desplazar hacia la derecha cuando el lateral está abierto
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            px: 2, // padding horizontal para que no se pegue a los bordes
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: lateralOpen ? `calc(100vw - ${anchoCaja * 2}px)` : '800px',
              minHeight: 'calc(100vh - 48px)',
              bgcolor: '#fff',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              p: '0.5cm',
            }}
          >
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </LateralBarContext.Provider>
  );
};

export default Layout;
