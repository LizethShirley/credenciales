
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Typography } from '@mui/material';

const CustomAddIcon = ({onClick}) =>{
  return (
    <IconButton 
        sx={{
        backgroundColor: '#058145',
        color: '#FFFFFF',
        borderRadius: '10px',           
        padding: '6px 16px', 
        display: 'flex',
        alignItems: 'center',
        gap: 1,                     
        transition: '0.3s',
        '&:hover': {
          backgroundColor: 'primary.main',
        },
      }}
    >
      <AddIcon/> 
      <Typography>
        Añadir
      </Typography>
    </IconButton>
  );
}

export default CustomAddIcon;