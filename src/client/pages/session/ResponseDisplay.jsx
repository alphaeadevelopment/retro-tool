import React from 'react';
import keys from 'lodash/keys';
import { withStyles } from 'material-ui/styles';
import ResponsesList from './ResponsesList';
import ResponsesChart from './ResponsesChart';
import getResponseValue from './get-response-value';

const styles = {

};

const YourResponses = ({ responses }) => (
  <ul>
    {keys(responses).map(r => (
      <li key={r} style={{ listStyle: 'none' }}>
        <span>{getResponseValue(responses[r].response)}</span>
      </li>
    ))}
  </ul>
);

const YourResponse = ({ responses }) => {
  if (responses.length === 0) return null;
  return (
    <p>You Responded: {responses.length === 1 && getResponseValue(responses[keys(responses)[0]].response)}</p>
  );
};

const getChartResponseComponent = (responseType, isOwner, sessionStatus) => {
  if (isOwner) {
    return ResponsesChart;
  }

  if (sessionStatus === 'initial') {
    return (responseType.allowMultiple) ? YourResponses : YourResponse;
  }

  return ResponsesChart;
};

export const getDisplayComponent = (responseType, isOwner, sessionStatus) => {
  switch (responseType.type) {
    case 'Yes/No':
    case 'Number':
    case 'Choices':
      return getChartResponseComponent(responseType, isOwner, sessionStatus);
    case 'text':
    default:
      return ResponsesList;
  }
};

export const RawResponseDisplay = ({
  classes, responseType, ...rest
}) => {
  const Component = getDisplayComponent(responseType, rest.isOwner, rest.sessionStatus);
  return (
    <Component responseType={responseType} {...rest} />
  );
};

export default withStyles(styles)(RawResponseDisplay);
