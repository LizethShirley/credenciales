import { Typography, Grid, Box, Paper, Container } from '@mui/material';
import CustomFormRegister from '../../components/organisms/CustomFormRegister';

const CredencialIndividual = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '80vh', bgcolor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Box sx={{ width: '100%', maxWidth: 990 }}>
          <Typography variant="h5" align="center">Registrar Datos</Typography>
          <CustomFormRegister />
      </Box>
    </Box>

  );
};

export default CredencialIndividual;
