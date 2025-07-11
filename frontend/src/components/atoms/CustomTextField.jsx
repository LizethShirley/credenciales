import { TextField, Typography } from '@mui/material';
import { useField } from 'formik';

const CustomTextField = ({ label, required = false, onlyNumbers = false, onlyLetters = false, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleKeyDown = (e) => {
    if (onlyNumbers) {
      // Permitir: 0-9, Backspace, Delete, Arrow keys, Tab
      if (!/^[0-9]$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
    }

    if (onlyLetters) {
      // Permitir: letras, espacio, tildes, Ñ, Backspace, Delete, Arrow keys, Tab
      const allowed = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
      if (!allowed.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <Typography
          variant="subtitle2"
        >
          {label}
          {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
        </Typography>
      )}

      <TextField
        {...field}
        {...props}
        type={onlyNumbers ? 'number' : 'text'}
        inputProps={{
          inputMode: onlyNumbers ? 'numeric' : 'text',
          style: onlyNumbers ? { MozAppearance: 'textfield' } : undefined,
        }}
        sx={
          onlyNumbers
            ? {
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }
            : {}
        }
        onKeyDown={handleKeyDown}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error}
        fullWidth
      />
    </div>
  );
};

export default CustomTextField;
