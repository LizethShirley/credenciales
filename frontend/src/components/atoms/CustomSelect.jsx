import { useField } from 'formik';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, Typography } from '@mui/material';

const CustomSelect = ({ label, options = [], required = false, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <FormControl fullWidth error={meta.touched && Boolean(meta.error)}>
      <Typography
          variant="subtitle2"
        >
          {label}
          {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
        </Typography>
      <Select size="small" {...field} sx={{ fontSize: '10pt', minHeight: '40px', height:'auto' }}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} sx={{ fontSize:'8pt' }}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
