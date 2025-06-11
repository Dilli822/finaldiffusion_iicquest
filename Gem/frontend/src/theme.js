import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4FC3F7', // Your primary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          color: '#fff', // Set text color for contained buttons to white
        },
      },
    },
  },
});

export default theme;
