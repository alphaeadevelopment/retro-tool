/* globals describe, it */
/* eslint-disable import/no-webpack-loader-syntax,import/no-extraneous-dependencies,import/no-unresolved,no-unused-expressions,max-len */
import React from 'react';
import chai, { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';
import App from './App';

chai.use(chaiEnzyme()); // Note the invocation at the end
chai.use(sinonChai);

Enzyme.configure({ adapter: new Adapter() });

describe('<App />', () => {
  it('renders', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).to.exist;
  });
});
