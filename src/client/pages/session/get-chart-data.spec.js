/* globals describe, it */
import { expect } from 'chai';

import getChartData from './get-chart-data';

describe('getChartData', () => {
  it('maps data - yes/no', () => {
    const responses = [
      { response: true },
      { response: true },
      { response: false },
    ];
    const expected = [
      {
        label: 'Yes', value: 2,
      },
      {
        label: 'No', value: 1,
      },
    ];
    expect(getChartData(responses)).to.deep.equal(expected);
  });
  it('maps data - numbers', () => {
    const responses = [
      { response: 1 },
      { response: 2 },
      { response: 1 },
    ];
    const expected = [
      {
        label: '1', value: 2,
      },
      {
        label: '2', value: 1,
      },
    ];
    expect(getChartData(responses)).to.deep.equal(expected);
  });
  it('maps data - adds missing \'No\' response', () => {
    const responses = [
      { response: true },
      { response: true },
    ];
    const expected = [
      {
        label: 'Yes', value: 2,
      },
      {
        label: 'No', value: 0,
      },
    ];
    expect(getChartData(responses)).to.deep.equal(expected);
  });
});
