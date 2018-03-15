/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
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
    it('creates a new session', (done) => {
      // assemble
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.returns(stubReturnSession);
      // daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      // act
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((createdSession) => {
          // assert
          expect(daoStubs.save).calledWith(sinon.match.object);
          expect(socketManagerStubs.saveSocket).calledWith(owner, socket);
          expect(createdSession).to.not.be.null;
          expect(createdSession).to.equal(stubReturnSession);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('getOwnerSocket', () => {
    xit('returns owner socket');
  });
  describe('isOwner', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        })
        .catch(e => done(e));
    });
    it('returns true for owner socket', (done) => {
      sessionManager.isOwner(socketId)
        .then((actual) => {
          expect(actual).to.equal(true);
          done();
        });
    });
    it('returns false for socket with no session', (done) => {
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
  describe('get session from socket id', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('returns session', (done) => {
      sessionManager.getSessionFromSocket(socketId)
        .then((actual) => {
          expect(actual).to.deep.equal(session);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('join session', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('adds participant', (done) => {
      // assemble
      daoStubs.getSession.returns(Promise.resolve(session));
      daoStubs.addParticipant.returns(Promise.resolve(session));

      const name = 'Bob';
      const bobSocket = { id: 'bobSocket' };

      // act
      sessionManager.joinSession(bobSocket, name, sessionId, token).then(() => {
        // assert
        expect(daoStubs.addParticipant).to.be.calledWith(sessionId, { id: name, name, votes: 0, connected: true });
        done();
      });
    });
    it('prevents socket id joining two sessions', (done) => {
      const name = 'Harry';
      const harrySocket = { id: 'harrySocket1' };
      daoStubs.getSession.returns(Promise.resolve(session));
      daoStubs.addParticipant.returns(Promise.resolve(session));
      sessionManager.joinSession(harrySocket, name, sessionId)
        .then(() => {
          sessionManager.joinSession(harrySocket, 'Another name', sessionId)
            .then(() => {
              expect.fail();
            })
            .catch((e) => {
              expect(e.message).to.equal('already in session');
              done();
            })
            .catch(e => done(e));
        })
        .catch(e => done(e));
    });
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
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('adds response', (done) => {
      // assemble
      const type = 'start';
      const message = 'Message';
      const expected = { id: dummyId, responseType: type, author: owner, response: message, votes: [] };
      const fakedResponse = { responses: { [dummyId]: expected } };
      daoStubs.addResponse.callsFake(() => Promise.resolve(fakedResponse));

      // act
      sessionManager.addResponse(socketId, type, message).then((actual) => {
        expect(daoStubs.addResponse).calledWith(sessionId, expected);
        expect(actual).to.deep.equal(expected);
        done();
      });
    });
  });
  describe('upVoteResponse', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('adds upvote to response', (done) => {
      daoStubs.upVoteResponse.returns(Promise.resolve());
      sessionManager.upVoteResponse(socketId, dummyId).then(() => {
        expect(daoStubs.upVoteResponse).calledWith(sessionId, dummyId);
        done();
      })
        .catch(e => done(e));
    });
  });
  describe('cancelUpVoteResponse', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('removes upvote to response', (done) => {
      daoStubs.cancelUpVoteResponse.returns(Promise.resolve());
      sessionManager.cancelUpVoteResponse(socketId, dummyId).then(() => {
        expect(daoStubs.cancelUpVoteResponse).calledWith(sessionId, dummyId);
        done();
      }).catch(e => done(e));
    });
  });
  describe('setStatus', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('changes status', (done) => {
      const status = 'voting';
      const dummyResponse = {};
      daoStubs.setStatus.returns(Promise.resolve(dummyResponse));
      sessionManager.setStatus(socketId, status).then((actual) => {
        expect(daoStubs.setStatus).calledWith(sessionId, status);
        expect(actual).to.equal(dummyResponse);
        done();
      }).catch(e => done(e));
    });
  });
  describe('addResponseType', () => {
    beforeEach((done) => {
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
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
      sessionManager.addResponseType(socketId, { question, type })
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
      sessionManager.addResponseType(socketId, { question, type, boolValue, numValue })
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
    beforeEach((done) => {
      daoStubs.addFeedback.resetHistory();
      sessionId = generate();
      daoStubs.save.resetHistory();
      daoStubs.getSession.resetHistory();
      const stubReturnSession = { id: sessionId, owner };
      daoStubs.save.callsFake(s => Promise.resolve(s));
      newSessionStub.resetHistory();
      newSessionStub.returns(stubReturnSession);
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('marks response as flagged with message', (done) => {
      // assemble
      daoStubs.addFeedback.callsFake((s, r, message) => Promise.resolve({ responses: { [r]: { flagged: true, feedback: message } } }));
      // act
      const responseId = generate();
      sessionManager.addFeedback(socketId, responseId, 'feedback')
        .then((updatedResponse) => {
          // assert
          expect(daoStubs.addFeedback).calledWith(sessionId, responseId, 'feedback');
          expect(updatedResponse).to.have.property('flagged', true);
          done();
        });
    });
  });
  describe('disconnect', () => {
    beforeEach((done) => {
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
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('disconnects the socket', (done) => {
      daoStubs.participantDisconnected.returns(Promise.resolve());
      // act
      sessionManager.disconnect(socketId)
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
    beforeEach((done) => {
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
      daoStubs.getSession.callsFake(() => Promise.resolve(stubReturnSession));
      sessionManager.createSession(sessionId, socket, owner, token)
        .then((s) => {
          session = s;
          done();
        });
    });
    it('reconnects the socket', (done) => {
      daoStubs.participantReconnected.returns(Promise.resolve());
      // act
      sessionManager.reconnect(socketId, token)
        .then(() => {
          // assert
          expect(daoStubs.participantReconnected).calledWith(sessionId, owner);
          done();
        })
        .catch(e => done(e));
    });
    it('reconnecting unknown socket fails gracefully', (done) => {
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
