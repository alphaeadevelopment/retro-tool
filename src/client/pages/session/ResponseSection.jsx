import React from 'react';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import NewResponseForm from './NewResponseForm';

const Response = ({ response, className }) => (
  <li className={className}>
    <Typography>
      {response.value}({response.name})
    </Typography>
    <div>
      <IconButton><ThumbUp style={{ color: 'green' }} /></IconButton>
      <IconButton><ThumbDown style={{ color: 'red' }} /></IconButton>
    </div>
  </li>
);
const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  responsesCtr: {
    padding: 0,
  },
  itemCtr: {
    'display': 'flex',
    'alignItems': 'center',
    'margin': `${theme.spacing.unit}px 0`,
    '&>p': {
      'flex': 8,
    },
    '& button': {
      'width': 'initial',
      'height': 'initial',
      'margin': `0 ${theme.spacing.unit}px`,
    },
  },
});
export const RawResponseSection = ({ classes, responseId, responses, onAdd }) => (
  <Paper className={classes.root}>
    <Typography variant={'subheading'}>{responseId}</Typography>
    <ul className={classes.responsesCtr}>
      {responses.map((r, idx) => (
        <Response
          key={idx // eslint-disable-line react/no-array-index-key
          }
          className={classes.itemCtr}
          response={r}
        />
      ))}
    </ul>
    <NewResponseForm onAdd={onAdd} />
  </Paper>
);
export default withStyles(styles)(RawResponseSection);
