/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax,import/no-unresolved */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./send-feedback');

describe('sendFeedback', () => {
  const io = {};
  let sendFeedback;
  const getSocketStub = sinon.stub();
  const sendFeedbackStub = sinon.stub();
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
  const sessionManager = {
    sendFeedback: sendFeedbackStub,
  };
  const socketManager = {
    getSocket: getSocketStub,
  };
  let author;
  const message = 'Rubbish';
  const responseId = 'responseId';
  before(() => {
    author = 'author';
    sendFeedback = inject({
      '../../session': sessionManager,
      '../../session/socket-manager': socketManager,
    }).default;
    broadcastToStub.returns({
      emit: broadcastEmitSpy,
    });
  });
  beforeEach(() => {
    socketEmitSpy.resetHistory();
    broadcastToStub.resetHistory();
  });
  it('join session and broadcasts - control', () => {
    // arrange
    getSocketStub.withArgs(author).returns(authorSocket);
    sendFeedbackStub.withArgs(socket.id, responseId, message).callsFake((socketId, r) => ({ id: r, author }));

    // act
    sendFeedback(io, socket)({ responseId, message });

    // assert
    expect(sendFeedbackStub).calledWith(socket.id, responseId, message);
    expect(authorSocketEmitSpy).calledWith('feedbackReceived', { responseId, message });
    expect(socketEmitSpy).calledWith('feedbackReceived', { responseId, message });
  });
});
