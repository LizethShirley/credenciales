import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const CustomEditIcon = ({ onClick}) => {
  return(
    <IconButton 
      size="small"  sx={{color: '#FBCC00', 
        '&:hover': {
          backgroundColor: 'primary.main',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        }
      }}
      onClick={onClick}
    >
      <EditIcon/>
    </IconButton>
  );
}

export default CustomEditIcon;