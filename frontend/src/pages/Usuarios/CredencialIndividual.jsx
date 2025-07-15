import { Typography, Grid, Box, Paper } from '@mui/material';

import CustomFormRegister from '../../components/molecules/CustomFormRegister';
import { useState, useEffect } from 'react';
const CredencialIndividual= () => {
  return (
    <Grid container spacing={2} sx={{ width: '100%', padding: 2, margin: 0}}>
    <Grid span={12} sx={{width: '100%'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: 'calc(90vh - 100px)', 
        }}
      >
        <Paper
        sx={{
          width: '100%',
          padding: 3,
          boxShadow: '0px 0px 10px 2px rgba(0,0,0,0.2)',
          backgroundColor: '#FFFFFF',
        }}
      >
         <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
          }}
        >
          Datos Personales
        </Typography>

          <CustomFormRegister/>

        </Paper>
        </Box>
        </Grid>
        </Grid>
    

  )
};

export default CredencialIndividual;