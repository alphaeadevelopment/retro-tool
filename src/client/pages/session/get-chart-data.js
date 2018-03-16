import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import getResponseValue from './get-response-value';

const addMissing = (data) => {
  const rv = clone(data);
  if (data.length === 1 && data[0].label === 'Yes') {
    rv.push({ label: 'No', value: 0 });
  }
  if (data.length === 1 && data[0].label === 'No') {
    rv.push({ label: 'Yes', value: 0 });
  }
  return rv;
};

export default (responses) => {
  const grouped = groupBy(responses, v => v.response);
  const values = mapValues(grouped, v => v.length);
  const data = keys(values).map(b => ({ label: getResponseValue(b), value: values[b] }));

  return addMissing(data);
};
