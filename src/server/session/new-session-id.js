import faker from 'faker';
import startCase from 'lodash/startCase';

export default () => startCase(`${faker.company.bsAdjective()} ${faker.company.bsNoun()}`).replace(/ /g, '');
