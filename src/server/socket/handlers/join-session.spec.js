/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import generate from 'shortid';

chai.use(sinonChai);

const inject = require('inject-loader!./join-session'); // eslint-disable-line import/no-unresolved

describe('joinSession', () => {
  const io = {};
  const joinRoomSpy = sinon.spy();
  const toSessionSpy = sinon.spy();
  const toSocketSpy = sinon.spy();
  const emitErrorSpy = sinon.spy();
  const callbacks = {
    joinRoom: joinRoomSpy,
    toSession: () => toSessionSpy,
    toSocket: toSocketSpy,
    emitError: emitErrorSpy,
  };
  let joinSession;
  const modifySessionStub = sinon.stub();
  const sessionManagerStubs = {
    sessionExists: sinon.stub(),
    joinSession: sinon.stub(),
  };
  const connectionManagerStubs = {
    registerSocket: sinon.stub(),
    deregisterSocket: sinon.stub(),
    socketRegistered: sinon.stub(),
    getConnection: sinon.stub(),
    getConnectionByToken: sinon.stub(),
  };
  let socket;
  before(() => {
    joinSession = inject({
      '../../session': { default: sessionManagerStubs, connectionManager: connectionManagerStubs },
      './modify-session': modifySessionStub,
    }).default;
    modifySessionStub.callsFake(s => s);
    connectionManagerStubs.socketRegistered.returns(Promise.resolve(false));
    connectionManagerStubs.registerSocket.returns(Promise.resolve());
  });
  beforeEach(() => {
    socket = {
      id: generate(),
    };
    sessionManagerStubs.sessionExists.resetHistory();
    sessionManagerStubs.joinSession.resetHistory();
    joinRoomSpy.resetHistory();
    toSessionSpy.resetHistory();
    toSocketSpy.resetHistory();
  });
  it('join session and broadcasts - control', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(true));
    const session = { id: sessionId };
    sessionManagerStubs.joinSession.returns(Promise.resolve(session));

    // act
    return joinSession(callbacks, io, socket)({ name, sessionId })
      .then(() => {
        // assert
        expect(sessionManagerStubs.sessionExists).calledWith(sessionId);
        expect(sessionManagerStubs.joinSession).calledWith(socket, name, sessionId);
        expect(joinRoomSpy).calledWith(sessionId);
        expect(toSessionSpy).calledWith('newParticipant', sinon.match({ name }));
        expect(toSocketSpy).calledWith('joinedSession', sinon.match({ session, name }));
      });
  });
  it('attempt to join session that doesn\'t exist', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(false));

    // act
    return joinSession(callbacks, io, socket)({ name, sessionId })
      .then(() => {
        // assert
        expect(emitErrorSpy).calledWith({ message: 'no such session' }, { sessionId });
      });
  });
  it('error on joining session', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(true));
    sessionManagerStubs.joinSession.returns(Promise.reject(new Error('name in use')));

    // act
    return joinSession(callbacks, io, socket)({ name, sessionId })
      .then(() => Promise.reject(new Error('expected error')))
      .catch((e) => {
        expect(e.message).to.equal('name in use');
      });
  });
});
