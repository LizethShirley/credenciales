import { useState } from "react";
import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LateralMenuItem = ({ titulo, subItems = [] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleOpen = () => setOpen(!open);

  const handleClickSubItem = (path) => {
    navigate(titulo+'/'+path);
  };

  return (
    <>
      <ListItemButton
        onClick={toggleOpen}
        sx={{
          '& .MuiListItemText-primary': { fontWeight: 'bold', fontSize: 18 },
          '&:hover .MuiListItemText-primary': { color: '#FFFFFF' }
        }}
      >
        <ListItemText primary={titulo} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{ pl: 4, '&:hover .MuiListItemText-primary': {
              color: '#FFFFFF',
              } }}
              onClick={() => handleClickSubItem(item.path)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default LateralMenuItem;
