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
  beforeEach(() => {
    sessionId = 'sessionId';
    socketId = 'socketId';
    owner = 'owner';
    socket = {
      id: socketId,
    };
    session = sessionManager.createSession(sessionId, socket, owner);
  });
  describe('new session', () => {
    it('creates a new session', () => {
      expect(session).to.not.be.null;
      expect(session).to.have.property('id', sessionId);
      expect(session).to.have.property('owner', owner);
      expect(session).to.have.property('participants').deep.equal({});
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
      expect(sessionManager.getOwnerSocket(sessionId)).to.equal(socket);
    });
  });
  describe('get session from socket id', () => {
    it('returns session', () => {
      const actual = sessionManager.getSessionFromSocket(socketId);
      expect(actual).to.deep.equal(session);
    });
  });
  describe('join session', () => {
    it('adds participant', () => {
      const name = 'Bob';
      const bobSocketId = 'bobSocket';
      updatedSession = sessionManager.joinSession(bobSocketId, name, sessionId);
      expect(updatedSession).to.have.property('participants').deep.equal({ [name]: { name } });
    });
    it('prevents socket id joining two sessions', () => {
      const name = 'Harry';
      const harrySocketId = 'harrySocket';
      updatedSession = sessionManager.joinSession(harrySocketId, name, sessionId);
      try {
        sessionManager.joinSession(harrySocketId, 'Harry2', sessionId);
        expect.fail();
      }
      catch (e) {
        expect(e.message).to.equal('already in session');
      }
    });
    it('prevents same name joining session', () => {
      const name = 'Harry';
      const harrySocketId = 'harrySocket2';
      updatedSession = sessionManager.joinSession(harrySocketId, name, sessionId);
      try {
        sessionManager.joinSession('new socket id', 'Harry', sessionId);
        expect.fail();
      }
      catch (e) {
        expect(e.message).to.equal('name in use');
      }
    });
  });
  describe('addResponse', () => {
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
    it('adds upvote to response', () => {
      const type = 'start';
      const message = 'Message';
      const response = sessionManager.addResponse(socketId, type, message);
      sessionManager.upVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').equal(1);
    });
  });
  describe('cancelUpVoteResponse', () => {
    it('removes upvote to response', () => {
      const type = 'start';
      const message = 'Message';
      const response = sessionManager.addResponse(socketId, type, message);
      sessionManager.upVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').equal(1);
      sessionManager.cancelUpVoteResponse(socketId, response.id);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.responses[response.id]).to.have.property('votes').equal(0);
    });
  });
  describe('setStatus', () => {
    it('changes status', () => {
      const status = 'voting';
      sessionManager.setStatus(socketId, status);
      updatedSession = sessionManager.getSession(sessionId);
      expect(updatedSession.status).to.equal(status);
    });
  });
  describe('addResponseType', () => {
    it('adds new response type', () => {
      const question = 'How well did we do?';
      const type = 'number';
      const expected = {
        id: 'newid',
        title: question,
        type,
      };
      const newResponseType = sessionManager.addResponseType(socketId, question, type);
      updatedSession = sessionManager.getSessionFromSocket(socketId);
      expect(updatedSession.responseTypes).to.have.property('newid').deep.equal(expected);
      expect(newResponseType).to.deep.equal(expected);
    });
  });
});
