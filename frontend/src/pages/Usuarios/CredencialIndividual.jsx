import { Typography, Grid, Box, Paper, Container } from '@mui/material';
import CustomFormRegister from '../../components/organisms/CustomFormRegister';

const CredencialIndividual = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', py: 4 }}>
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Paper
          sx={{
            padding: 3,
            boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
            backgroundColor: '#FFFFFF',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              component="img"
              src="/TEDLogo.jpg"
              alt="Logo TED"
              sx={{ width: 60, height: 'auto', pointerEvents: 'none', opacity: 0.8 }}
            />
            <Box sx={{backgroundColor:"primary.main", width:2, height: 40}} />
            <Box
              component="img"
              src="/EleccionesLogo.png"
              alt="Decoración Inferior"
              sx={{ width: 60, height: 'auto', pointerEvents: 'none', opacity: 0.8 }}
            />
          </Box>
          <Typography variant="h6" sx={{pt:0, textAlign: 'center', mb: 1, color:"#04465F", fontWeight:"bold" }}>
            Datos Personales
          </Typography>
          <CustomFormRegister />
        </Paper>
      </Box>
    </Box>

  );
};

export default CredencialIndividual;
