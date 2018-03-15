/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax,import/no-unresolved */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./send-feedback');

describe('sendFeedback', () => {
  const io = {};
  let addFeedback;
  const getSocketStub = sinon.stub();
  const socketEmitSpy = sinon.spy();
  const authorSocketEmitSpy = sinon.spy();
  const joinSpy = sinon.spy();
  const broadcastToStub = sinon.stub();
  const broadcastEmitSpy = sinon.spy();
  const socket = {
    emit: socketEmitSpy,
    join: joinSpy,
    broadcast: {
      to: broadcastToStub,
    },
  };
  const authorSocket = {
    emit: authorSocketEmitSpy,
  };
  const sessionManagerStubs = {
    addFeedback: sinon.stub(),
  };
  const connectionManagerStubs = {
    registerSocket: sinon.stub(),
    deregisterSocket: sinon.stub(),
    socketRegistered: sinon.stub(),
    getConnection: sinon.stub(),
    getConnectionByToken: sinon.stub(),
  };
  const socketManager = {
    getSocket: getSocketStub,
  };
  let author;
  const message = 'Rubbish';
  const name = 'name';
  const sessionId = 'sessionId';
  const responseId = 'responseId';
  const connection = { name, sessionId };
  before(() => {
    author = 'author';
    addFeedback = inject({
      '../../session': { default: sessionManagerStubs, connectionManager: connectionManagerStubs },
      '../../session/socket-manager': socketManager,
    }).default;
    broadcastToStub.returns({
      emit: broadcastEmitSpy,
    });
    connectionManagerStubs.getConnection.returns(Promise.resolve(connection));
  });
  beforeEach(() => {
    socketEmitSpy.resetHistory();
    broadcastToStub.resetHistory();
  });
  it('join session and broadcasts - control', (done) => {
    // arrange
    getSocketStub.withArgs(author).returns(authorSocket);
    sessionManagerStubs.addFeedback
      .withArgs(connection, responseId, message)
      .callsFake((socketId, r) => Promise.resolve({ id: r, author }));

    // act
    addFeedback(io, socket)({ responseId, message })
      .then(() => {
        // assert
        expect(sessionManagerStubs.addFeedback).calledWith(connection, responseId, message);
        expect(authorSocketEmitSpy).calledWith('feedbackReceived', { responseId, message });
        expect(socketEmitSpy).calledWith('feedbackReceived', { responseId, message });
        done();
      })
      .catch(e => done(e));
  });
});
