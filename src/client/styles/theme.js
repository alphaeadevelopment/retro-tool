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
  },
};

export default createMuiTheme(theme);
