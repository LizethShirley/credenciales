import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const CustomDeleteIcon = ({onClick}) => {
  return (
    <IconButton sx={{backgroundColor: 'red', color: '#FFFFFF',
      '&:hover': {
          backgroundColor: 'primary.main',
      }}}
    >
      <DeleteIcon/>
    </IconButton>
  )
}

export default CustomDeleteIcon;