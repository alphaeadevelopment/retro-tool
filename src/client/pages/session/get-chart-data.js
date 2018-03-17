import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';
import keys from 'lodash/keys';
import clone from 'lodash/clone';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
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

export const denormaliseResponses = (responses) => {
  const rv = [];
  forEach(responses, (r) => {
    if (isArray(r.response)) {
      r.response.forEach((rr) => {
        rv.push({ ...r, response: rr });
      });
    }
    else {
      rv.push(r);
    }
  });
  return rv;
};

export default (responses) => {
  const denormalised = denormaliseResponses(responses);
  const grouped = groupBy(denormalised, v => v.response);
  const values = mapValues(grouped, v => v.length);
  const data = keys(values).map(b => ({ label: getResponseValue(b), value: values[b] }));

  return addMissing(data);
};
