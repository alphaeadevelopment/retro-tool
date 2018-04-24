/* globals xdescribe, xit, before describe, it, beforeEach, afterEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import generate from 'shortid';
// import * as sessionMother from './dao/session-mother';

chai.use(sinonChai);

const inject = require('inject-loader!./session-manager'); // eslint-disable-line import/no-unresolved

const newSessionStub = sinon.stub();
const socketManagerStubs = {
  saveSocket: sinon.stub(),
  getSocket: sinon.stub(),
  removeSocket: sinon.stub(),
};
const connectionManagerStubs = {
  registerSocket: sinon.stub(),
  deregisterSocket: sinon.stub(),
  socketRegistered: sinon.stub(),
  getConnection: sinon.stub(),
  getConnectionByToken: sinon.stub(),
};
connectionManagerStubs.registerSocket.returns(Promise.resolve());
connectionManagerStubs.deregisterSocket.returns(Promise.resolve());
connectionManagerStubs.socketRegistered.returns(Promise.resolve(false));
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
  './socket-manager': socketManagerStubs,
  './connection-manager': connectionManagerStubs,
  './session-dao': daoStubs,
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
  const token = 'token';
  describe('new session', () => {
    beforeEach(() => {
      newSessionStub.resetHistory();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      sessionId = generate();
      socketManagerStubs.saveSocket.resetHistory();
      socketManagerStubs.getSocket.withArgs(owner).returns(socket);
    });
    it('creates a new session', () => {
      // assemble
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.returns(stubReturnSession);
      // act
      return sessionManager.createSession(sessionId, socket, owner, token)
        .then((createdSession) => {
          // assert
          expect(daoStubs.save).calledWith(sinon.match.object);
          // expect(connectionManagerStubs.registerSocket).calledWith(socketId, owner, sessionId);
          expect(socketManagerStubs.saveSocket).calledWith(owner, socket);
          expect(createdSession).to.not.be.null;
          expect(createdSession).to.equal(stubReturnSession);
        });
    });
  });
  describe('getOwnerSocket', () => {
    xit('returns owner socket');
  });
  describe('isOwner', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
    });
    it('returns true for owner socket', (done) => {
      // connectionManagerStubs.getConnection.returns(Promise.resolve());
      sessionManager.isOwner({ sessionId, name: owner })
        .then((actual) => {
          expect(actual).to.equal(true);
          done();
        });
    });
    it('returns false for socket with no session', (done) => {
      connectionManagerStubs.getConnection.returns(Promise.resolve({}));
      sessionManager.isOwner('other socket')
        .then((actual) => {
          expect(actual).to.equal(false);
          done();
        });
    });
  });
  describe('sessionExists', () => {
    beforeEach(() => {
      daoStubs.sessionExists.resetHistory();
      sessionId = generate();
    });
    it('returns true for existing session', (done) => {
      // assemble
      const expected = true;
      daoStubs.sessionExists.withArgs(sessionId).returns(Promise.resolve(expected));

      sessionManager.sessionExists(sessionId)
        .then((actual) => {
          expect(actual).to.equal(expected);
          done();
        })
        .catch(e => done(e));
    });
    it('returns false for non-existent session', (done) => {
      // assemble
      const expected = false;
      daoStubs.sessionExists.withArgs('abc').returns(Promise.resolve(expected));

      sessionManager.sessionExists('abc')
        .then((actual) => {
          // assert
          expect(actual).to.equal(expected);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('join session', () => {
    let clock;
    const now = Date.now();
    let stubReturnSession;
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      clock = sinon.useFakeTimers(now);
    });
    afterEach(() => {
      clock.restore();
    });
    it('adds participant', () => {
      // assemble
      daoStubs.getSession.returns(Promise.resolve(stubReturnSession));
      daoStubs.addParticipant.returns(Promise.resolve(session));

      const name = 'Bob';
      const bobSocket = { id: 'bobSocket' };

      // act
      return sessionManager.joinSession(bobSocket, name, sessionId, token)
        .then(() => {
          // assert
          expect(daoStubs.addParticipant).to.be.calledWith(sessionId, { id: name, name, joinedAt: now, votes: 0, connected: true });
        });
    });
    // it('prevents socket id joining two sessions', (done) => {
    //   // connectionManagerStubs.socketRegistered.returns(Promise.resolve(true));
    //   daoStubs.getSession.returns(Promise.resolve({ ...stubReturnSession, participants: { Harry: {} } }));
    //   sessionManager.joinSession(socket, 'Harry', sessionId)
    //     .then(() => {
    //       expect.fail();
    //     })
    //     .catch((e) => {
    //       expect(e.message).to.equal('already in session');
    //       done();
    //     })
    //     .catch(e => done(e));
    // });
    it('prevents same name joining session', (done) => {
      // assemble
      daoStubs.getSession.returns(Promise.resolve({ ...session, participants: { Harry: {} } }));
      // act
      sessionManager.joinSession({ id: 'new socket id' }, 'Harry', sessionId)
        .then(() => {
          expect.fail();
        })
        .catch((e) => {
          expect(e.message).to.equal('name in use');
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('addResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
    });
    it('adds response', (done) => {
      // assemble
      const type = 'start';
      const message = 'Message';
      const expected = { id: dummyId, responseType: type, author: owner, response: message, votes: [] };
      const fakedResponse = { responses: { [dummyId]: expected } };
      daoStubs.addResponse.callsFake(() => Promise.resolve(fakedResponse));

      // act
      sessionManager.addResponse({ sessionId, name: owner }, type, message).then((actual) => {
        expect(daoStubs.addResponse).calledWith(sessionId, expected);
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
  describe('upVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('adds upvote to response', (done) => {
      daoStubs.upVoteResponse.returns(Promise.resolve());
      sessionManager.upVoteResponse({ sessionId, name: owner }, dummyId).then(() => {
        expect(daoStubs.upVoteResponse).calledWith(sessionId, dummyId);
        done();
      })
        .catch(e => done(e));
    });
  });
  describe('cancelUpVoteResponse', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('removes upvote to response', (done) => {
      daoStubs.cancelUpVoteResponse.returns(Promise.resolve());
      sessionManager.cancelUpVoteResponse({ sessionId, name: owner }, dummyId).then(() => {
        expect(daoStubs.cancelUpVoteResponse).calledWith(sessionId, dummyId);
        done();
      }).catch(e => done(e));
    });
  });
  describe('setStatus', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('changes status', (done) => {
      const status = 'voting';
      const dummyResponse = {};
      daoStubs.setStatus.returns(Promise.resolve(dummyResponse));
      sessionManager.setStatus({ sessionId }, status).then((actual) => {
        expect(daoStubs.setStatus).calledWith(sessionId, status);
        expect(actual).to.equal(dummyResponse);
        done();
      }).catch(e => done(e));
    });
  });
  describe('addResponseType', () => {
    beforeEach(() => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      daoStubs.addResponseType.resetHistory();
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('adds new response type', (done) => {
      // assemble
      const question = 'How well did we do?';
      const type = 'number';
      const expected = {
        id: dummyId,
        title: question,
        type,
      };
      daoStubs.addResponseType.returns(Promise.resolve(expected));
      // act
      sessionManager.addResponseType({ sessionId, name: owner }, { question, type })
        .then((newResponseType) => {
          // assert
          expect(daoStubs.addResponseType).calledWith(sessionId, expected);
          expect(newResponseType).to.deep.equal(expected);
          done();
        })
        .catch(e => done(e));
    });
    it('adds new response type with arbritary fields', (done) => {
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
      sessionManager.addResponseType({ sessionId, name: owner }, { question, type, boolValue, numValue })
        .then((newResponseType) => {
          // assert
          expect(daoStubs.addResponseType).calledWith(sessionId, expected);
          expect(newResponseType).to.deep.equal(expected);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('addFeedback', () => {
    beforeEach(() => {
      daoStubs.addFeedback.resetHistory();
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('marks response as flagged with message', (done) => {
      // assemble
      daoStubs.addFeedback.callsFake((s, r, message) => Promise.resolve({ responses: { [r]: { flagged: true, feedback: message } } }));
      // act
      const responseId = generate();
      sessionManager.addFeedback({ sessionId, name: owner }, responseId, 'feedback')
        .then((updatedResponse) => {
          // assert
          expect(daoStubs.addFeedback).calledWith(sessionId, responseId, 'feedback');
          expect(updatedResponse).to.have.property('flagged', true);
          done();
        });
    });
  });
  describe('disconnect', () => {
    beforeEach(() => {
      sessionId = generate();
      socketManagerStubs.removeSocket.resetHistory();
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // connectionManagerStubs.getConnection.returns(Promise.resolve({ sessionId, name: owner }));
    });
    it('disconnects the socket', (done) => {
      daoStubs.participantDisconnected.returns(Promise.resolve());
      // act
      sessionManager.disconnect({ sessionId, name: owner })
        .then(() => {
          // assert
          expect(daoStubs.participantDisconnected).calledWith(sessionId, owner);
          done();
        })
        .catch(e => done(e));
    });
    it('disconnects an unknown socket without error', (done) => {
      sessionManager.disconnect('abc')
        .then(() => done())
        .catch(() => expect.fail())
        .catch(e => done(e));
    });
  });
  describe('reconnect', () => {
    beforeEach(() => {
      daoStubs.participantReconnected.resetHistory();
      sessionId = generate();
      socketManagerStubs.removeSocket.resetHistory();
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.returns(Promise.resolve(stubReturnSession));
    });
    it('reconnects the socket', (done) => {
      // connectionManagerStubs.getConnectionByToken.returns(Promise.resolve({ sessionId, name: owner }));
      daoStubs.participantReconnected.returns(Promise.resolve());
      // act
      sessionManager.reconnect({ sessionId, name: owner }, socket)
        .then(() => {
          // assert
          expect(daoStubs.participantReconnected).calledWith(sessionId, owner);
          done();
        })
        .catch(e => done(e));
    });
    it('reconnecting unknown socket fails gracefully', (done) => {
      connectionManagerStubs.getConnectionByToken.returns(Promise.resolve({}));
      sessionManager.reconnect(socket, 'garbage')
        .then(() => {
          expect.fail('should have thrown error');
        })
        .catch((e) => {
          expect(e.message).to.equal('unknown token');
          done();
        });
    });
  });
});
