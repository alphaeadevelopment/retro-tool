import faker from 'faker';
import startCase from 'lodash/startCase';

export default () => startCase(`${faker.random.words()}`).replace(/ /g, '');
