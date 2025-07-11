import { Typography, IconButton } from '@mui/material';
import PortraitIcon from '@mui/icons-material/Portrait';

const CustomUploadImage = ({ label, required = false, selectedFile, handleFileChange }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="subtitle2">
        {label}
        {required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
      </Typography>

      {/* Solo acepta imágenes */}
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <label htmlFor="file-upload">
        <IconButton
          component="span"
          disableRipple
          disableFocusRipple
          sx={{ padding: 0 }}
        >
          <PortraitIcon
            sx={{
              color: '#FFFFFF',
              backgroundColor: '#FBCC00',
              width: 100,
              height: 100,
              padding: 2,
              borderRadius: 2, // cuadrado con esquinas ligeramente redondeadas
              '&:hover': {
                backgroundColor: '#FBCC00',
              },
            }}
          />
        </IconButton>
      </label>

      {selectedFile && (
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          Archivo seleccionado: {selectedFile.name}
        </Typography>
      )}
    </div>
  );
};

export default CustomUploadImage;
