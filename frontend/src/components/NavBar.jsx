import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const NavBar = (anchoCaja) => {
  return (
    <AppBar position="fixed" sx={{ width: '100%'}}>
      <Toolbar>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: '32px', color: 'FFFFFF' }}>
            SISTEMA DE CREDENCIALES
          </Typography>
          <Typography variant="h6" noWrap component="div" sx={{ fontSize: '30px', color: 'FFFFFF' }}>
            TRIBUNAL DEPARTAMENTAL COCHABAMBA
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
