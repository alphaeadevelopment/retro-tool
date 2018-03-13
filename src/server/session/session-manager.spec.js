/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const inject = require('inject-loader!./session-manager'); // eslint-disable-line import/no-unresolved

const shortid = sinon.stub();
shortid.returns('newid');
const sessionManager = inject({
  shortid,
}).default;

describe('session manager', () => {
  let session;
  let updatedSession;
  let sessionId;
  let socketId;
  let socket;
  let owner = 'owner';
  describe('new session', () => {
    beforeEach(() => {
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('creates a new session', () => {
      expect(session).to.not.be.null;
      expect(session).to.have.property('id', sessionId);
      expect(session).to.have.property('owner', owner);
      expect(session).to.have.property('participants').deep.equal({ [owner]: { name: owner, votes: 0 } });
      expect(session).to.have.property('responses');
      expect(session).to.have.property('responseTypes');
      expect(session).to.have.property('sockets');
      expect(session.responseTypes).to.have.property('stop');
      expect(session.responseTypes.stop).to.have.property('title');
      expect(session.responseTypes).to.have.property('start');
      expect(session.responseTypes.start).to.have.property('title');
      expect(session.responseTypes).to.have.property('continue');
      expect(session.responseTypes.continue).to.have.property('title');
      expect(session).to.have.property('status', 'initial');
      expect(sessionManager.getSession(sessionId)).deep.equal(session);
      expect(sessionManager.getOwnerSocket(sessionId)).to.equal(socket);
    });
  });
  describe('isOwner', () => {
    beforeEach(() => {
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
      session = sessionManager.createSession(sessionId, socket, owner);
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('returns session', () => {
      const actual = sessionManager.getSessionFromSocket(socketId);
      expect(actual).to.deep.equal(session);
    });
  });
  describe('join session', () => {
    beforeEach(() => {
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('adds participant', () => {
      const name = 'Bob';
      const bobSocket = { id: 'bobSocket' };
      updatedSession = sessionManager.joinSession(bobSocket, name, sessionId);
      const theSocket = sessionManager.getSocket(sessionId, name);
      expect(updatedSession).to.have.property('participants');
      expect(updatedSession.participants).to.have.property(name);
      expect(updatedSession.participants[name]).to.have.property('votes');
      expect(updatedSession.participants[name]).to.have.property('name', name);
      expect(theSocket).to.deep.equal(bobSocket);
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
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
      sessionId = 'sessionId';
      socketId = 'socketId';
      owner = 'owner';
      socket = {
        id: socketId,
      };
      session = sessionManager.createSession(sessionId, socket, owner);
    });
    it('marks response as flagged with message', () => {
      const response = sessionManager.addResponse(socketId, 'start', 'message');
      const updatedResponse = sessionManager.sendFeedback(socketId, response.id, 'feedback');
      expect(updatedResponse).to.have.property('flagged', true);
    });
  });
});
