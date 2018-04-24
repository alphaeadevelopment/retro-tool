/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import generate from 'shortid';

chai.use(sinonChai);

const inject = require('inject-loader!./send-feedback'); // eslint-disable-line import/no-unresolved

describe('sendFeedback', () => {
  const io = {};
  const joinRoomSpy = sinon.spy();
  const toRoomStub = sinon.stub();
  const toRoomSpy = sinon.spy();
  toRoomStub.returns(toRoomSpy);
  const toSessionParticipantStub = sinon.stub();
  const toSessionParticipantSpy = sinon.spy();
  toSessionParticipantStub.returns(toSessionParticipantSpy);
  const toSocketSpy = sinon.spy();
  const getConnectionStub = sinon.stub();
  const callbacks = {
    toSocket: toSocketSpy,
    getConnection: getConnectionStub,
    toSessionParticipant: toSessionParticipantStub,
  };
  let sendFeedback;
  const sessionManagerStubs = {
    addFeedback: sinon.stub(),
  };
  let socket;
  const author = 'author';
  const sessionId = 'sessionId';
  const name = 'name';
  const responseId = 'responseId';
  const message = 'message';
  const connection = {
    sessionId, name,
  };
  before(() => {
    sendFeedback = inject({
      '../../session': sessionManagerStubs,
    }).default;
    getConnectionStub.returns(Promise.resolve(connection));
  });
  beforeEach(() => {
    socket = {
      id: generate(),
    };
    sessionManagerStubs.addFeedback.resetHistory();
    joinRoomSpy.resetHistory();
    toRoomSpy.resetHistory();
    toRoomStub.resetHistory();
    toSessionParticipantStub.resetHistory();
    toSessionParticipantSpy.resetHistory();
    toSocketSpy.resetHistory();
  });
  it('join session and broadcasts - control', () => {
    // arrange
    sessionManagerStubs.addFeedback
      .withArgs(connection, responseId, message)
      .callsFake((socketId, r) => Promise.resolve({ id: r, author }));

    // act
    return sendFeedback(callbacks, io, socket)({ responseId, message })
      .then(() => {
        // assert
        expect(sessionManagerStubs.addFeedback).calledWith(connection, responseId, message);
        expect(toSessionParticipantStub).calledWith(sessionId, author);
        expect(toSessionParticipantSpy).calledWith('feedbackReceived', { responseId, message });
        expect(toSocketSpy).calledWith('feedbackReceived', { responseId, message });
      });
  });
});
