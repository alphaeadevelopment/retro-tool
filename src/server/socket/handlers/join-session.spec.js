/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax,import/no-unresolved */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./join-session');

describe('joinSession', () => {
  const io = {};
  let joinSession;
  const modifySessionStub = sinon.stub();
  const sessionExistsStub = sinon.stub();
  const joinSessionStub = sinon.stub();
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
  const sessionManager = {
    sessionExists: sessionExistsStub,
    joinSession: joinSessionStub,
  };
  before(() => {
    joinSession = inject({
      '../../session': sessionManager,
      './modify-session': modifySessionStub,
    }).default;
    broadcastToStub.returns({
      emit: broadcastEmitSpy,
    });
    modifySessionStub.callsFake(s => s);
  });
  beforeEach(() => {
    sessionExistsStub.resetHistory();
    joinSessionStub.resetHistory();
    socketEmitSpy.resetHistory();
    broadcastToStub.resetHistory();
  });
  it('join session and broadcasts - control', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionExistsStub.returns(true);
    const session = { id: sessionId };
    joinSessionStub.returns(session);

    // act
    joinSession(io, socket)({ name, sessionId });

    // assert
    expect(sessionExistsStub).calledWith(sessionId);
    expect(joinSessionStub).calledWith(sinon.match.object, name, sessionId);
    expect(joinSpy).calledWith(sessionId);
    expect(broadcastEmitSpy).calledWith('newParticipant', sinon.match({ name }));
    expect(socketEmitSpy).calledWith('joinedSession', sinon.match({ session, name }));
  });
  it('attempt to join session that doesn\'t exist', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionExistsStub.returns(false);
    const session = { id: sessionId };
    joinSessionStub.returns(session);

    // act
    joinSession(io, socket)({ name, sessionId });

    // assert
    expect(socketEmitSpy).calledWith('applicationError', { message: 'no such session' });
  });
  it('error on joining session', () => {
    // arrange
    const name = 'name';
    const sessionId = 'sessionId';
    sessionExistsStub.returns(true);
    joinSessionStub.throws(new Error('already in session'));

    // act
    joinSession(io, socket)({ name, sessionId });

    // assert
    expect(socketEmitSpy).calledWith('applicationError', { message: 'already in session' });
  });
});
