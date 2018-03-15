/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import chai, { expect } from 'chai';
import generate from 'shortid';
// import dao from './mongo-dao';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const collectionStubs = {
  insert: sinon.stub(),
};
const client = {
  db: () => ({ collection: () => collectionStubs }),
  close: () => null,
};

const mongodb = {
  MongoClient: {
    connect: () => Promise.resolve(client),
  },
};

const inject = require('inject-loader!./mongo-dao'); // eslint-disable-line import/no-unresolved

const dao = inject({
  'mongodb': mongodb,
}).default;

describe('mongo dao', () => {
  describe('save', () => {
    beforeEach(() => {
      collectionStubs.insert.resetHistory();
    });
    it('saves session', (done) => {
      // assemble
      const sessionId = generate();
      const session = {
        'id': sessionId,
        'foo': 'bar',
      };
      collectionStubs.insert.returns(Promise.resolve({ ops: [session] }));
      // act
      dao.save(session)
        .then((actual) => {
          // assert
          expect(actual).to.deep.equal(session);
          expect(collectionStubs.insert).calledWith({ ...session, _id: session.id });
          done();
        })
        .catch(e => done(e));
    });
  });
  // describe('with dummy session', () => {
  //   const sessionId = generate();
  //   const owner = generate();
  //   const session = fakeSession(sessionId, owner);
  //   beforeEach(() => {
  //     dao.save(session);
  //   });
  //   describe('sessionExists', () => {
  //     it('returns true for existing session', () => {
  //       const expected = true;
  //       const actual = dao.sessionExists(sessionId);
  //       expect(expected).to.equal(actual);
  //     });
  //     it('returns false for non-existing session', () => {
  //       const expected = false;
  //       const actual = dao.sessionExists('fake');
  //       expect(expected).to.equal(actual);
  //     });
  //   });
  //   describe('add participant', () => {
  //     it('adds participant', () => {
  //       const name = generate();
  //       const newParticipant = {
  //         name,
  //       };
  //       const updatedSession = dao.addParticipant(sessionId, newParticipant);
  //       expect(updatedSession).to.have.property('participants');
  //       expect(updatedSession.participants).to.have.property(name).deep.equal(newParticipant);
  //     });
  //   });
  //   describe('addResponse', () => {
  //     it('adds response', () => {
  //       const name = generate();
  //       const id = generate();
  //       const value = generate();
  //       const responseType = generate();
  //       const newResponse = {
  //         id, author: name, response: value, responseType, votes: [],
  //       };
  //       const updatedSession = dao.addResponse(sessionId, newResponse);
  //       expect(updatedSession).to.have.property('responses');
  //       expect(updatedSession.responses).to.have.property(id).deep.equal(newResponse);
  //     });
  //   });
  //   describe('upVoteResponse', () => {
  //     it('adds upvote to response', () => {
  //       const name = generate();
  //       const id = generate();
  //       const value = generate();
  //       const responseType = generate();
  //       const newResponse = {
  //         id, author: name, response: value, responseType, votes: [],
  //       };
  //       dao.addResponse(sessionId, newResponse);
  //       const updatedSession = dao.upVoteResponse(sessionId, id, owner);
  //       expect(updatedSession.responses[id]).to.have.property('votes').deep.equal([owner]);
  //       expect(updatedSession.participants[owner]).to.have.property('votes').equal(1);
  //     });
  //   });
  //   describe('cancelUpVoteResponse', () => {
  //     it('removes upvote to response', () => {
  //       const name = generate();
  //       const id = generate();
  //       const value = generate();
  //       const responseType = generate();
  //       const newResponse = {
  //         id, author: name, response: value, responseType, votes: [],
  //       };
  //       dao.addResponse(sessionId, newResponse);
  //       dao.upVoteResponse(sessionId, id, owner);
  //       const updatedSession = dao.cancelUpVoteResponse(sessionId, id, owner);
  //       expect(updatedSession.responses[id]).to.have.property('votes').deep.equal([]);
  //       expect(updatedSession.participants[owner]).to.have.property('votes').equal(0);
  //     });
  //   });
  //   describe('setStatus', () => {
  //     it('changes status', () => {
  //       const status = 'voting';
  //       const updatedSession = dao.setStatus(sessionId, status);
  //       expect(updatedSession.status).to.equal(status);
  //     });
  //   });
  //   describe('addResponseType', () => {
  //     it('adds new response type', () => {
  //       const question = 'How well did we do?';
  //       const type = 'number';
  //       const id = generate();
  //       const newResponseType = {
  //         id,
  //         title: question,
  //         type,
  //       };
  //       const updatedSession = dao.addResponseType(sessionId, newResponseType);
  //       expect(updatedSession.responseTypes).to.have.property(id).deep.equal(newResponseType);
  //     });
  //   });
  //   describe('sendFeedback', () => {
  //     it('marks response as flagged with message', () => {
  //       const name = generate();
  //       const id = generate();
  //       const value = generate();
  //       const responseType = generate();
  //       const message = generate();
  //       const newResponse = {
  //         id, author: name, response: value, responseType, votes: [],
  //       };
  //       dao.addResponse(sessionId, newResponse);
  //       const updatedSession = dao.addFeedback(sessionId, id, message);
  //       expect(updatedSession.responses[id]).to.have.property('flagged', true);
  //       expect(updatedSession.responses[id]).to.have.property('feedback', message);
  //     });
  //   });
  //   describe('participantDisconnected', () => {
  //     it('marks participant as disconnected', () => {
  //       const updatedSession = dao.participantDisconnected(sessionId, owner);

  //       expect(updatedSession.participants[owner]).to.have.property('connected', false);
  //     });
  //   });
  //   describe('participantDisconnected', () => {
  //     it('marks participant as connected', () => {
  //       dao.participantDisconnected(sessionId, owner);
  //       const updatedSession = dao.participantReconnected(sessionId, owner);
  //       expect(updatedSession.participants[owner]).to.have.property('connected', true);
  //     });
  //   });
  //   describe('removeParticipant', () => {
  //     it('removes participant', () => {
  //       const updatedSession = dao.removeParticipant(sessionId, owner);
  //       expect(updatedSession.participants).to.not.have.property(owner);
  //     });
  //   });
  // });
});
