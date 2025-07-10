import { AppBar, Toolbar, Typography, Box, Stack} from '@mui/material';

const NavBar = (anchoCaja) => {
  return (
    <AppBar position="fixed"
  sx={{
    width: '100vw', 
    left: 0,        
    right: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    
  }}>
      <Toolbar disableGutters sx={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
        <Box sx={{ height: '8px', backgroundColor: '#FBCC00', width: '100%' }} />
        <Box sx={{ backgroundColor: '#ffffff'}}>
          <Stack direction="row" spacing={40} justifyContent="center" alignItems="center" p={0.2}>
            <img src="/OEPLogo.jpg" alt="img1" height={55}/>
            <img src="/TEDLogo.jpg" alt="img2" height={55} />
            <img src="/EleccionesLogo.png" alt="img3" height={55} />
          </Stack>
        </Box>
        <Box sx={{ textAlign: 'center', width: '100%'}}>
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: '21px',backgroundColor: 'primary.main', color: '#FFFFFF' }}>
            SISTEMA DE CREDENCIALES
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
