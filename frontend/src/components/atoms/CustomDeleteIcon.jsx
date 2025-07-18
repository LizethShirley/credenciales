import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const CustomDeleteIcon = ({onClick}) => {
  return (
    <IconButton size="small" sx={{backgroundColor: 'red', color: '#FFFFFF',
      '&:hover': {
        backgroundColor: 'primary.main',
      },
        '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        }
      }}
    >
      <DeleteIcon/>
    </IconButton>
  )
}

export default CustomDeleteIcon;