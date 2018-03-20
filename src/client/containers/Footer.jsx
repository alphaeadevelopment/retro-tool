import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    'display': 'flex',
    'background': theme.palette.primary.dark,
    'fontSize': '80%',
    '&>div': {
      'top': '100%',
      'display': 'flex',
      'justifyContent': 'space-between',
      'width': '100%',
      'margin': theme.spacing.unit,
      '&>p': {
        'color': theme.palette.primary.contrastText,
      },
    },
  },
});
export const RawFooter = ({ classes }) => (
  <div className={classes.root}>
    <div>
      <Typography variant={'body1'}>
        <a target={'_new'} href={'https://alphaeadevelopment.github.io/retro-tool/'}>Retrospective Tool</a>
      </Typography>
      <Typography variant={'body1'}>
        <span>Powered by </span>
        <a target={'_new'} href={'http://alphaea.uk'}>Alphaea Development</a>
      </Typography>
    </div>
  </div>
);
export default withStyles(styles)(RawFooter);
