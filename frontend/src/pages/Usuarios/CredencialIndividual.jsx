import { Typography, Grid, Box, Paper, Container } from '@mui/material';
import CustomFormRegister from '../../components/organisms/CustomFormRegister';

const CredencialIndividual = () => {
  return (
    <Grid
  container
  justifyContent="center"
  width="100%" 
  sx={{ px: 2, justifyContent:"center"}}
>
  <Grid item xs={12} sx={{justifyContent:"center"}}>
    <Paper
      sx={{
        padding: 3,
        boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
        backgroundColor: '#FFFFFF',
        position: 'relative',
      }}
    >
      {/*<Grid container justifyContent="center" spacing={2}>*/}
      <Grid container spacing={2} justifyContent="center" sx={{ width: { xs: "100hv"}}}>
        <Box
        component="img"
        src="/TEDLogo.jpg"
        alt="Logo TED"
        sx={{
          width: '10%',
          height: 'auto',
          pointerEvents: 'none',
          opacity: 0.8
        }}
      />
      <Box sx={{backgroundColor:"primary.main", width:2}}>

      </Box>
      <Box
        component="img"
        src="/EleccionesLogo.png"
        alt="Decoración Inferior"
        sx={{
          width: '10%',
          height: 'auto',
          pointerEvents: 'none',
          opacity: 0.8
        }}
      />
      </Grid>
      <Typography variant="h6" sx={{pt:0, textAlign: 'center', mb: 1, color:"#04465F", fontWeight:"bold" }}>
        Datos Personales
      </Typography>

      <CustomFormRegister />
    </Paper>
  </Grid>
</Grid>

  );
};

export default CredencialIndividual;
