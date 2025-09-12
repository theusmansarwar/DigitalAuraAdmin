import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const CustomAlert = ({ type, message }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message && type) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, type]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // Appears on the right
      TransitionComponent={(props) => <Slide {...props} direction="right" />} // Slide in from right
    >
      <Alert variant="filled" severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;