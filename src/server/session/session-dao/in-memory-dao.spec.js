/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import { expect } from 'chai';
import generate from 'shortid';
import dao from './in-memory-dao';

const fakeSession = (id, owner) => ({
  id,
  status: 'initial',
  participants: {
    [owner]: {
      name: owner,
      votes: 0,
      connected: true,
    },
  },
  owner,
  responses: {
  },
  responseTypes: {
    continue: {
      id: 'continue',
      title: 'What went well?',
      allowMultiple: true,
      type: 'text',
    },
    stop: {
      id: 'stop',
      title: 'What did not work well?',
      allowMultiple: true,
      type: 'text',
    },
    start: {
      id: 'start',
      title: 'What could be improved?',
      allowMultiple: true,
      type: 'text',
    },
  },
});

describe('in memory dao', () => {
  describe('save', () => {
    it('saves session', (done) => {
      const sessionId = generate();
      const session = {
        id: sessionId,
      };
      dao.save(session)
        .then((actual) => {
          expect(actual).to.deep.equal(session);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('with dummy session', () => {
    const sessionId = generate();
    const owner = generate();
    const session = fakeSession(sessionId, owner);
    beforeEach((done) => {
      dao.save(session)
        .then(() => done())
        .catch(e => done(e));
    });
    describe('getSession', () => {
      it('returns session', (done) => {
        dao.getSession(sessionId)
          .then((actual) => {
            expect(actual).to.deep.equal(session);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('sessionExists', () => {
      it('returns true for existing session', (done) => {
        const expected = true;
        dao.sessionExists(sessionId)
          .then((actual) => {
            expect(expected).to.equal(actual);
            done();
          })
          .catch(e => done(e));
      });
      it('returns false for non-existing session', (done) => {
        const expected = false;
        dao.sessionExists('fake')
          .then((actual) => {
            expect(expected).to.equal(actual);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('add participant', () => {
      it('adds participant', (done) => {
        const name = generate();
        const newParticipant = {
          name,
        };
        dao.addParticipant(sessionId, newParticipant)
          .then((updatedSession) => {
            expect(updatedSession).to.have.property('participants');
            expect(updatedSession.participants).to.have.property(name).deep.equal(newParticipant);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('addResponse', () => {
      it('adds response', (done) => {
        const name = generate();
        const id = generate();
        const value = generate();
        const responseType = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse)
          .then((actual) => {
            expect(actual).to.have.property('responses');
            expect(actual.responses).to.have.property(id).deep.equal(newResponse);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('upVoteResponse', () => {
      it('adds upvote to response', (done) => {
        const name = generate();
        const id = generate();
        const value = generate();
        const responseType = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse);
        dao.upVoteResponse(sessionId, id, owner)
          .then((actual) => {
            expect(actual.responses[id]).to.have.property('votes').deep.equal([owner]);
            expect(actual.participants[owner]).to.have.property('votes').equal(1);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('cancelUpVoteResponse', () => {
      it('removes upvote to response', (done) => {
        const name = generate();
        const id = generate();
        const value = generate();
        const responseType = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse);
        dao.upVoteResponse(sessionId, id, owner);
        dao.cancelUpVoteResponse(sessionId, id, owner)
          .then((actual) => {
            expect(actual.responses[id]).to.have.property('votes').deep.equal([]);
            expect(actual.participants[owner]).to.have.property('votes').equal(0);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('setStatus', () => {
      it('changes status', (done) => {
        const status = 'voting';
        dao.setStatus(sessionId, status)
          .then((actual) => {
            expect(actual.status).to.equal(status);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('addResponseType', () => {
      it('adds new response type', (done) => {
        const question = 'How well did we do?';
        const type = 'number';
        const id = generate();
        const newResponseType = {
          id,
          title: question,
          type,
        };
        dao.addResponseType(sessionId, newResponseType)
          .then((actual) => {
            expect(actual.responseTypes).to.have.property(id).deep.equal(newResponseType);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('sendFeedback', () => {
      it('marks response as flagged with message', (done) => {
        const name = generate();
        const id = generate();
        const value = generate();
        const responseType = generate();
        const message = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse);
        dao.addFeedback(sessionId, id, message)
          .then((actual) => {
            expect(actual.responses[id]).to.have.property('flagged', true);
            expect(actual.responses[id]).to.have.property('feedback', message);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('participantDisconnected', () => {
      it('marks participant as disconnected', (done) => {
        dao.participantDisconnected(sessionId, owner)
          .then((actual) => {
            expect(actual.participants[owner]).to.have.property('connected', false);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('participantDisconnected', () => {
      it('marks participant as connected', (done) => {
        dao.participantDisconnected(sessionId, owner);
        dao.participantReconnected(sessionId, owner)
          .then((actual) => {
            expect(actual.participants[owner]).to.have.property('connected', true);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('removeParticipant', () => {
      it('removes participant', (done) => {
        dao.removeParticipant(sessionId, owner)
          .then((actual) => {
            expect(actual.participants).to.not.have.property(owner);
            done();
          })
          .catch(e => done(e));
      });
    });
  });
});
