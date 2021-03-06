/* globals xdescribe, xit, before, describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax,import/no-extraneous-dependencies */
import { expect } from 'chai';
import generate from 'shortid';
import dao from './mongo-dao';
import * as sessionMother from './session-mother';

describe('mongo dao', () => {
  describe('save', () => {
    it('saves session', (done) => {
      // assemble
      const sessionId = generate();
      const session = {
        'id': sessionId,
        'foo': 'bar',
      };
      // act
      dao.save(session)
        .then((actual) => {
          // assert
          expect(actual).to.deep.equal(session);
          done();
        })
        .catch(e => done(e));
    });
  });
  describe('with dummy session', () => {
    let sessionId;
    let owner;
    let session;
    beforeEach((done) => {
      sessionId = generate();
      owner = generate();
      session = sessionMother.fakeSession(sessionId, owner);
      dao.save(session).then(() => done());
    });
    describe('sessionExists', () => {
      it('returns true for existing session', () => {
        const expected = true;
        return dao.sessionExists(sessionId)
          .then((actual) => {
            expect(actual).to.equal(expected);
          });
      });
      it('returns false for non-existing session', (done) => {
        const expected = false;
        dao.sessionExists('fake')
          .then((actual) => {
            expect(actual).to.equal(expected);
            done();
          })
          .catch(e => done(e));
      });
    });
    describe('get most recent non-owner participant', () => {
      it('returns expected participant', () => {
        const expected = 'participant2';
        return dao.getMostRecentNonOwnerParticipant(sessionId)
          .then((actual) => {
            expect(actual).to.equal(expected);
          });
      });
      it('returns null for unidentified session', () => dao.getMostRecentNonOwnerParticipant('invalid')
        .then((actual) => {
          expect(actual).to.be.undefined;
        }));
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
            expect(updatedSession.participants).to.have.property(owner);
            expect(updatedSession.numParticipants).to.equal(4);
            expect(updatedSession.connectedParticipants).to.equal(4);
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
          .then((updatedSession) => {
            expect(updatedSession).to.have.property('responses');
            expect(updatedSession.responses).to.have.property(id).deep.equal(newResponse);
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
        dao.addResponse(sessionId, newResponse).then(() => {
          dao.upVoteResponse(sessionId, id, name).then((updatedSession) => {
            expect(updatedSession.responses[id]).to.have.property('votes').deep.equal([name]);
            expect(updatedSession.participants[name]).to.have.property('votes').equal(1);
            done();
          }).catch(e => done(e));
        }).catch(e => done(e));
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
        dao.addResponse(sessionId, newResponse).then(() => {
          dao.upVoteResponse(sessionId, id, owner).then(() => {
            dao.cancelUpVoteResponse(sessionId, id, owner).then((updatedSession) => {
              expect(updatedSession.responses[id]).to.have.property('votes').deep.equal([]);
              expect(updatedSession.participants[owner]).to.have.property('votes').equal(0);
              done();
            }).catch(e => done(e));
          }).catch(e => done(e));
        }).catch(e => done(e));
      });
    });
    describe('setStatus', () => {
      it('changes status', (done) => {
        const status = 'voting';
        dao.setStatus(sessionId, status).then((updatedSession) => {
          expect(updatedSession.status).to.equal(status);
          done();
        }).catch(e => done(e));
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
        dao.addResponseType(sessionId, newResponseType).then((updatedSession) => {
          expect(updatedSession.responseTypes).to.have.property(id).deep.equal(newResponseType);
          expect(updatedSession.responseTypes).to.have.property('stop');
          expect(updatedSession.responseTypes).to.have.property('start');
          expect(updatedSession.responseTypes).to.have.property('continue');
          done();
        }).catch(e => done(e));
      });
    });
    describe('addFeedback', () => {
      it('marks response as flagged with message', (done) => {
        const name = generate();
        const id = generate();
        const value = generate();
        const responseType = generate();
        const message = generate();
        const newResponse = {
          id, author: name, response: value, responseType, votes: [],
        };
        dao.addResponse(sessionId, newResponse).then(() => {
          dao.addFeedback(sessionId, id, message).then((updatedSession) => {
            expect(updatedSession.responses[id]).to.have.property('flagged', true);
            expect(updatedSession.responses[id]).to.have.property('feedback', message);
            done();
          }).catch(e => done(e));
        }).catch(e => done(e));
      });
    });
    describe('participantDisconnected', () => {
      it('marks participant as disconnected', (done) => {
        dao.participantDisconnected(sessionId, owner).then((updatedSession) => {
          expect(updatedSession.participants[owner]).to.have.property('connected', false);
          expect(updatedSession.numParticipants).to.equal(3);
          expect(updatedSession.connectedParticipants).to.equal(2);
          done();
        }).catch(e => done(e));
      });
    });
    describe('participantReconnected', () => {
      it('marks participant as connected', (done) => {
        dao.participantReconnected(sessionId, owner)
          .then((updatedSession) => {
            expect(updatedSession.participants[owner]).to.have.property('connected', true);
            expect(updatedSession.numParticipants).to.equal(3);
            expect(updatedSession.connectedParticipants).to.equal(4);
            done();
          })
          .catch(done);
      });
    });
    describe('removeParticipant', () => {
      it('removes participant', (done) => {
        dao.removeParticipant(sessionId, owner).then((updatedSession) => {
          expect(updatedSession.participants).to.not.have.property(owner);
          expect(updatedSession.numParticipants).to.equal(2);
          expect(updatedSession.connectedParticipants).to.equal(2);
          done();
        }).catch(e => done(e));
      });
    });
    describe('zeroConnectedParticipants', () => {
      const sessionId2 = generate();
      before((done) => {
        const zeroSession = {
          id: sessionId2,
          connectedParticipants: 2,
        };
        // act
        dao.save(zeroSession)
          .then(() => {
            done();
          })
          .catch(e => done(e));
      });
      it('removes participant', (done) => {
        dao.resetAllConnections()
          .then(() => {
            dao.getSession(sessionId2)
              .then((sess) => {
                expect(sess.connectedParticipants).to.equal(0);
                done();
              })
              .catch(e => done(e));
          })
          .catch(e => done(e));
      });
    });
  });
});
