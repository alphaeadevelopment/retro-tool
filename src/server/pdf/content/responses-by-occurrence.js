import forEach from 'lodash/forEach';
import orderBy from 'lodash/orderBy';
import reverse from 'lodash/reverse';
import getChartData from '../../../client/pages/session/get-chart-data';

const inOrder = r => reverse(orderBy(r, 'value'));

export default (responseType, responses, page) => {
  const data = getChartData(responses);
  forEach(inOrder(data), (r) => {
    page.text(`${r.label}: ${r.value}`, { indent: 20 });
  });
};
