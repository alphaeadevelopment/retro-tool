import React from 'react';
import { withStyles } from 'material-ui/styles';
import NewResponseForm from './NewResponseForm';

const Response = ({ response }) => (
  <div>
    <p>
      {response.value}({response.name})
    </p>
  </div>
);
const styles = {
  root: {

  },
};
export const RawResponseSection = ({ classes, responseId, responses, onAdd }) => (
  <div className={classes.root}>
    {responseId}
    {responses.map((r, idx) => (
      <Response
        key={idx // eslint-disable-line react/no-array-index-key
        }
        response={r}
      />
    ))}
    <NewResponseForm onAdd={onAdd} />
  </div>
);
export default withStyles(styles)(RawResponseSection);
