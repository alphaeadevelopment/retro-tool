/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import generate from 'shortid';

chai.use(sinonChai);

const inject = require('inject-loader!./session-manager'); // eslint-disable-line import/no-unresolved

const newSessionStub = sinon.stub();
const saveSocketStub = sinon.stub();
const getSocketStub = sinon.stub();
const removeSocketStub = sinon.stub();
const socketManager = {
  saveSocket: saveSocketStub,
  getSocket: getSocketStub,
  removeSocket: removeSocketStub,
};
const daoStubs = {
  save: sinon.stub(),
  upVoteResponse: sinon.stub(),
  setStatus: sinon.stub(),
  cancelUpVoteResponse: sinon.stub(),
  getSession: sinon.stub(),
  sessionExists: sinon.stub(),
  addFeedback: sinon.stub(),
  addResponse: sinon.stub(),
  addResponseType: sinon.stub(),
  addParticipant: sinon.stub(),
  removeParticipant: sinon.stub(),
  participantDisconnected: sinon.stub(),
  participantReconnected: sinon.stub(),
};
const shortidStub = sinon.stub();
const dummyId = 'newId';
shortidStub.returns(dummyId);
const sessionManager = inject({
  'shortid': shortidStub,
  './socket-manager': socketManager,
  './dao': daoStubs,
  './new-session': newSessionStub,
}).default;

describe('session manager', () => {
  let session;
  let sessionId;
  const socketId = 'socketId';
  const socket = {
    id: socketId,
  };
  const owner = 'owner';
  let token = 'token';
  describe('new session', () => {
    beforeEach(() => {
      newSessionStub.resetHistory();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      sessionId = generate();
      saveSocketStub.resetHistory();
      getSocketStub.withArgs(owner).returns(socket);
    });
    it('creates a new session', () => {
      // assemble
      const createdSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => s);
      newSessionStub.returns(createdSession);
      daoStubs.getSession.callsFake(() => createdSession);
      // act
      session = sessionManager.createSession(sessionId, socket, owner, token);
      // assert
      expect(daoStubs.save).calledWith(sinon.match.object);
      expect(saveSocketStub).calledWith(owner, socket);
      expect(session).to.not.be.null;
      expect(session).to.equal(createdSession);
      expect(sessionManager.getSession(sessionId)).deep.equal(session);
      expect(sessionManager.getOwnerSocket(sessionId)).to.deep.equal(socket);
      expect(daoStubs.getSession).calledWith(sessionId);
    });
  });
  describe('isOwner', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('returns true for owner socket', () => {
      const actual = sessionManager.isOwner(socketId);
      expect(actual).to.equal(true);
    });
    it('returns false for socket with no session', () => {
      const actual = sessionManager.isOwner('other socket');
      expect(actual).to.equal(false);
    });
    it('returns false for other user socket', () => {
      const otherSocketId = 'other socket';
      sessionManager.joinSession({ id: otherSocketId }, 'Bob', sessionId);
      const actual = sessionManager.isOwner(otherSocketId);
      expect(actual).to.equal(false);
    });
  });
  describe('sessionExists', () => {
    beforeEach(() => {
      daoStubs.sessionExists.resetHistory();
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('returns true for existing session', () => {
      // assemble
      const expected = true;
      daoStubs.sessionExists.withArgs(sessionId).returns(expected);

      const actual = sessionManager.sessionExists(sessionId);
      // exps
      expect(actual).to.equal(expected);
    });
    it('returns false for non-existent session', () => {
      // assemble
      const expected = false;
      daoStubs.sessionExists.withArgs('abc').returns(expected);

      const actual = sessionManager.sessionExists('abc');
      // exps
      expect(actual).to.equal(expected);
    });
  });
  describe('get session from socket id', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('returns session', () => {
      const actual = sessionManager.getSessionFromSocket(socketId);
      expect(actual).to.deep.equal(session);
    });
  });
  describe('join session', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.callsFake(s => s);
      newSessionStub.returns({ id: sessionId, owner });
      daoStubs.addParticipant.resetHistory();
      daoStubs.getSession.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('adds participant', () => {
      // assemble
      daoStubs.getSession.returns(session);

      const name = 'Bob';
      const bobSocket = { id: 'bobSocket' };

      // act
      sessionManager.joinSession(bobSocket, name, sessionId, token);

      // assert
      expect(daoStubs.addParticipant).to.be.calledWith(sessionId, { id: name, name, votes: 0, connected: true });
    });
    it('prevents socket id joining two sessions', () => {
      const name = 'Harry';
      const harrySocket = { id: 'harrySocket1' };
      sessionManager.joinSession(harrySocket, name, sessionId);
      try {
        sessionManager.joinSession(harrySocket, 'Another name', sessionId);
        expect.fail();
      }
      catch (e) {
        expect(e.message).to.equal('already in session');
      }
    });
    it('prevents same name joining session', () => {
      // assemble
      daoStubs.getSession.returns({ ...session, participants: { Harry: {} } });
      // act
      try {
        sessionManager.joinSession({ id: 'new socket id' }, 'Harry', sessionId);
        expect.fail();
      }
      catch (e) {
        expect(e.message).to.equal('name in use');
      }
    });
  });
  describe('addResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.addResponse.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds response', () => {
      const type = 'start';
      const message = 'Message';
      const expected = { id: dummyId, responseType: type, author: owner, response: message, votes: [] };
      const fakedResponse = { responses: { [dummyId]: expected } };
      daoStubs.addResponse.callsFake(() => fakedResponse);

      const actual = sessionManager.addResponse(socketId, type, message);
      expect(daoStubs.addResponse).calledWith(sessionId, expected);

      expect(actual).to.deep.equal(expected);
    });
  });
  describe('upVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.upVoteResponse.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds upvote to response', () => {
      sessionManager.upVoteResponse(socketId, dummyId);
      expect(daoStubs.upVoteResponse).calledWith(sessionId, dummyId);
    });
  });
  describe('cancelUpVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.cancelUpVoteResponse.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('removes upvote to response', () => {
      sessionManager.cancelUpVoteResponse(socketId, dummyId);
      expect(daoStubs.cancelUpVoteResponse).calledWith(sessionId, dummyId);
    });
  });
  describe('setStatus', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.setStatus.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('changes status', () => {
      const status = 'voting';
      sessionManager.setStatus(socketId, status);
      expect(daoStubs.setStatus).calledWith(sessionId, status);
    });
  });
  describe('addResponseType', () => {
    beforeEach(() => {
      daoStubs.addResponseType.resetHistory();
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds new response type', () => {
      // assemble
      const question = 'How well did we do?';
      const type = 'number';
      const expected = {
        id: dummyId,
        title: question,
        type,
      };
      // act
      const newResponseType = sessionManager.addResponseType(socketId, { question, type });
      // assert
      expect(daoStubs.addResponseType).calledWith(sessionId, expected);
      expect(newResponseType).to.deep.equal(expected);
    });
    it('adds new response type with arbritary fields', () => {
      // assemble
      const question = 'How well did we do?';
      const type = 'number';
      const boolValue = true;
      const numValue = 7;
      const expected = {
        id: dummyId,
        title: question,
        type,
        boolValue,
        numValue,
      };
      // act
      const newResponseType = sessionManager.addResponseType(socketId, { question, type, boolValue, numValue });
      // assert
      expect(daoStubs.addResponseType).calledWith(sessionId, expected);
      expect(newResponseType).to.deep.equal(expected);
    });
  });
  describe('addFeedback', () => {
    beforeEach(() => {
      daoStubs.addFeedback.resetHistory();
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('marks response as flagged with message', () => {
      // assemble
      daoStubs.addFeedback.callsFake((s, r, message) => ({ responses: { [r]: { flagged: true, feedback: message } } }));
      // act
      const responseId = generate();
      const updatedResponse = sessionManager.addFeedback(socketId, responseId, 'feedback');
      // assert
      expect(daoStubs.addFeedback).calledWith(sessionId, responseId, 'feedback');
      expect(updatedResponse).to.have.property('flagged', true);
    });
  });
  describe('disconnect', () => {
    beforeEach(() => {
      sessionId = generate();
      removeSocketStub.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('disconnects the socket', () => {
      // act
      sessionManager.disconnect(socketId);
      // assert
      expect(daoStubs.participantDisconnected).calledWith(sessionId, owner);
    });
    it('disconnects an unknown socket without error', () => {
      try {
        sessionManager.disconnect('abc');
      }
      catch (e) {
        expect.fail();
      }
    });
  });
  describe('reconnect', () => {
    beforeEach(() => {
      daoStubs.participantReconnected.resetHistory();
      sessionId = generate();
      token = generate();
      saveSocketStub.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('reconnects the socket', () => {
      // act
      sessionManager.reconnect(socketId, token);
      // assert
      expect(daoStubs.participantReconnected).calledWith(sessionId, owner);
    });
    it('reconnecting unknown socket fails gracefully', () => {
      try {
        sessionManager.reconnect(socket, 'garbage');
        expect.fail('should have thrown error');
      }
      catch (e) {
        expect(e.message).to.equal('unknown token');
      }
    });
  });
});
