import { createMuiTheme } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import red from 'material-ui/colors/red';
import blueGrey from 'material-ui/colors/blueGrey';

const theme = {
  palette: {
    primary: {
      main: blueGrey[600],
    },
    secondary: teal,
    error: red,
  },
  overrides: {
    MuiInput: {
      root: {
        fontSize: 'inherit',
      },
    },
    MuiTypography: {
      subheading: {
        fontWeight: '500',
      },
      display1: {
        fontSize: '1.2rem',
      },
      display2: {
        fontSize: '1.5rem',
      },
      display3: {
        fontSize: '2rem',
      },
    },
  },
};

export default createMuiTheme(theme);
