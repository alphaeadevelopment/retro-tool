/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import generate from 'shortid';

chai.use(sinonChai);

const inject = require('inject-loader!./session-manager'); // eslint-disable-line import/no-unresolved

const saveSocketStub = sinon.stub();
const getSocketStub = sinon.stub();
const removeSocketStub = sinon.stub();
const socketManager = {
  saveSocket: saveSocketStub,
  getSocket: getSocketStub,
  removeSocket: removeSocketStub,
};
const shortidStub = sinon.stub();
shortidStub.returns('newid');
const sessionManager = inject({
  'shortid': shortidStub,
  './socket-manager': socketManager,
}).default;

describe('session manager', () => {
  let session;
  let sessionId;
  let updatedSession;
  const socketId = 'socketId';
  const socket = {
    id: socketId,
  };
  const owner = 'owner';
  let token = 'token';
  describe('new session', () => {
    beforeEach(() => {
      sessionId = generate();
      saveSocketStub.resetHistory();
      getSocketStub.withArgs(owner).returns(socket);
    });
    it('creates a new session', () => {
      session = sessionManager.createSession(sessionId, socket, owner, token);
      expect(saveSocketStub).calledWith(owner, socket);
      expect(session).to.not.be.null;
      expect(session).to.have.property('id', sessionId);
      expect(session).to.have.property('owner', owner);
      expect(session).to.have.property('participants').deep.equal({ [owner]: { name: owner, votes: 0, connected: true } });
      expect(session).to.have.property('responses');
      expect(session).to.have.property('responseTypes');
      expect(session.responseTypes).to.have.property('stop');
      expect(session.responseTypes.stop).to.have.property('title');
      expect(session.responseTypes).to.have.property('start');
      expect(session.responseTypes.start).to.have.property('title');
      expect(session.responseTypes).to.have.property('continue');
      expect(session.responseTypes.continue).to.have.property('title');
      expect(session).to.have.property('status', 'initial');
      expect(sessionManager.getSession(sessionId)).deep.equal(session);
      expect(sessionManager.getOwnerSocket(sessionId)).to.deep.equal(socket);
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
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('adds participant', () => {
      const name = 'Bob';
      const bobSocket = { id: 'bobSocket' };
      updatedSession = sessionManager.joinSession(bobSocket, name, sessionId);
      expect(updatedSession).to.have.property('participants');
      expect(updatedSession.participants).to.have.property(name);
      expect(updatedSession.participants[name]).to.have.property('votes');
      expect(updatedSession.participants[name]).to.have.property('connected', true);
      expect(updatedSession.participants[name]).to.have.property('name', name);
      expect(saveSocketStub).calledWith(name, bobSocket);
    });
    it('prevents socket id joining two sessions', () => {
      const name = 'Harry';
      const harrySocket = { id: 'harrySocket1' };
      updatedSession = sessionManager.joinSession(harrySocket, name, sessionId);
      try {
        sessionManager.joinSession(harrySocket, 'Another name', sessionId);
        expect.fail();
      }
      catch (e) {
        expect(e.message).to.equal('already in session');
      }
    });
    it('prevents same name joining session', () => {
      const name = 'Harry';
      const harrySocket = { id: 'harrySocket2' };
      updatedSession = sessionManager.joinSession(harrySocket, name, sessionId);
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
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds response', () => {
      const type = 'start';
      const message = 'Message';
      const response = sessionManager.addResponse(socketId, type, message);
      expect(response).to.have.property('responseType', type);
      expect(response).to.have.property('author', owner);
      expect(response).to.have.property('response', message);
      expect(response).to.have.property('id');
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses).to.have.property(response.id).deep.equal(response);
    });
  });
  describe('upVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds upvote to response', () => {
      const type = 'start';
      const message = 'Message';
      const response = sessionManager.addResponse(socketId, type, message);
      sessionManager.upVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').deep.equal([owner]);
      expect(updatedSession.participants[owner]).to.have.property('votes').equal(1);
    });
  });
  describe('cancelUpVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('removes upvote to response', () => {
      const type = 'start';
      const message = 'Message';
      const response = sessionManager.addResponse(socketId, type, message);
      sessionManager.upVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').deep.equal([owner]);
      expect(updatedSession.participants[owner]).to.have.property('votes').equal(1);
      sessionManager.cancelUpVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').deep.equal([]);
      expect(updatedSession.participants[owner]).to.have.property('votes').equal(0);
    });
  });
  describe('setStatus', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('changes status', () => {
      const status = 'voting';
      sessionManager.setStatus(socketId, status);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.status).to.equal(status);
    });
  });
  describe('addResponseType', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds new response type', () => {
      const question = 'How well did we do?';
      const type = 'number';
      const expected = {
        id: 'newid',
        title: question,
        type,
      };
      const newResponseType = sessionManager.addResponseType(socketId, { question, type });
      updatedSession = sessionManager.getSessionFromSocket(socketId);
      expect(updatedSession.responseTypes).to.have.property('newid').deep.equal(expected);
      expect(newResponseType).to.deep.equal(expected);
    });
    it('adds new response type with arbritary fields', () => {
      const question = 'How well did we do?';
      const type = 'number';
      const boolValue = true;
      const numValue = 7;
      const expected = {
        id: 'newid',
        title: question,
        type,
        boolValue,
        numValue,
      };
      const newResponseType = sessionManager.addResponseType(socketId, { question, type, boolValue, numValue });
      updatedSession = sessionManager.getSessionFromSocket(socketId);
      expect(updatedSession.responseTypes).to.have.property('newid').deep.equal(expected);
      expect(newResponseType).to.deep.equal(expected);
    });
  });
  describe('sendFeedback', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('marks response as flagged with message', () => {
      const response = sessionManager.addResponse(socketId, 'start', 'message');
      const updatedResponse = sessionManager.sendFeedback(socketId, response.id, 'feedback');
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
      sessionManager.disconnect(socketId);

      const disconnectedSession = sessionManager.getSessionId(socketId);
      updatedSession = sessionManager.getSession(sessionId);
      expect(disconnectedSession).to.be.undefined;
      expect(updatedSession.participants[owner]).to.have.property('connected', false);
      expect(removeSocketStub).calledWith(owner);
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
      sessionId = generate();
      token = generate();
      saveSocketStub.resetHistory();
      session = sessionManager.createSession(sessionId, socket, owner, token);
    });
    it('reconnects the socket', () => {
      sessionManager.disconnect(socketId);
      const newSocketId = 'newSocketId';
      const newSocket = {
        id: newSocketId,
      };
      const reconnection = sessionManager.reconnect(newSocket, token);
      const reconnectedSession = reconnection.session;
      const reconnectedName = reconnection.name;

      expect(reconnectedSession).to.deep.equal(session);
      expect(reconnectedName).to.equal(owner);
      expect(saveSocketStub).calledWith(owner, newSocket);
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
  describe('rejoin', () => {
    beforeEach(() => {
      sessionId = generate();
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('can leave and rejoin session', () => {
      sessionManager.leaveSession(socket.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.participants).not.to.have.property(owner);

      sessionManager.joinSession(socket, owner, sessionId, token);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.participants).to.have.property(owner);
    });
  });
});
