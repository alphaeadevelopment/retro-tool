/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./socket-manager'); // eslint-disable-line import/no-unresolved

const shortidStub = sinon.stub();
shortidStub.returns('newid');
const socketManager = inject({
}).default;

describe('socket manager', () => {
  let socket;
  let name;
  describe('save socket', () => {
    beforeEach(() => {
      name = 'Jim';
      socket = {
        id: name,
      };
    });
    it('saves socket', () => {
      socketManager.saveSocket(name, socket);
      const savedSocket = socketManager.getSocket(name);
      expect(savedSocket).to.deep.equal(socket);
    });
  });
});
