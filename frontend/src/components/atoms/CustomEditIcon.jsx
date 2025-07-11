import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const CustomEditIcon = ({ onClick}) => {
  return(
    <IconButton 
      sx={{backgroundColor: '#FBCC00', color: '#FFFFFF', 
        '&:hover': {
          backgroundColor: 'primary.main',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        }
      }}
    >
      <EditIcon/>
    </IconButton>
  );
}

export default CustomEditIcon;