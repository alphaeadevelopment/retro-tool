/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./join-session'); // eslint-disable-line import/no-unresolved

describe('joinSession', () => {
  const io = {};
  let joinSession;
  const modifySessionStub = sinon.stub();
  const socketEmitSpy = sinon.spy();
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
  before(() => {
    joinSession = inject({
      '../../session': { default: sessionManagerStubs, connectionManager: connectionManagerStubs },
      './modify-session': modifySessionStub,
    }).default;
    broadcastToStub.returns({
      emit: broadcastEmitSpy,
    });
    modifySessionStub.callsFake(s => s);
    connectionManagerStubs.socketRegistered.returns(Promise.resolve(false));
    connectionManagerStubs.registerSocket.returns(Promise.resolve());
  });
  beforeEach(() => {
    sessionManagerStubs.sessionExists.resetHistory();
    sessionManagerStubs.joinSession.resetHistory();
    joinSpy.resetHistory();
    socketEmitSpy.resetHistory();
    broadcastToStub.resetHistory();
  });
  it('join session and broadcasts - control', (done) => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(true));
    const session = { id: sessionId };
    sessionManagerStubs.joinSession.returns(Promise.resolve(session));

    // act
    joinSession(io, socket)({ name, sessionId })
      .then(() => {
        // assert
        expect(sessionManagerStubs.sessionExists).calledWith(sessionId);
        expect(sessionManagerStubs.joinSession).calledWith(socket, name, sessionId);
        expect(joinSpy).calledWith(sessionId);
        expect(broadcastEmitSpy).calledWith('newParticipant', sinon.match({ name }));
        expect(socketEmitSpy).calledWith('joinedSession', sinon.match({ session, name }));
        done();
      })
      .catch(e => done(e));
  });
  it('attempt to join session that doesn\'t exist', (done) => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(false));
    const session = { id: sessionId };
    sessionManagerStubs.joinSession.returns(Promise.resolve(session));

    // act
    joinSession(io, socket)({ name, sessionId })
      .then(() => {
        // assert
        expect(socketEmitSpy).calledWith('applicationError', { message: 'no such session', parameters: { sessionId } });
        done();
      })
      .catch(e => done(e));
  });
  it('error on joining session', (done) => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionManagerStubs.sessionExists.returns(Promise.resolve(true));
    sessionManagerStubs.joinSession.returns(Promise.reject(new Error('name in use')));

    // act
    joinSession(io, socket)({ name, sessionId })
      .then(() => {
        // assert
        expect(socketEmitSpy).calledWith(
          'applicationError',
          { message: 'name in use', parameters: { name, sessionId } },
        );
        done();
      })
      .catch(e => done(e));
  });
});
