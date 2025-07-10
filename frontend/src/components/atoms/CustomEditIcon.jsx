import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const CustomEditIcon = ({ onClick}) => {
  return(
    <IconButton 
      sx={{backgroundColor: '#FBCC00', color: '#FFFFFF', 
        '&:hover': {
          backgroundColor: 'primary.main',
      }}}
    >
      <EditIcon/>
    </IconButton>
  );
}

export default CustomEditIcon;