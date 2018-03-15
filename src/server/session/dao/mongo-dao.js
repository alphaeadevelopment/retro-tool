/* eslint-disable no-unused-vars */
import { MongoClient } from 'mongodb';
import omit from 'lodash/omit';

class MongoDao {
  sessionsCollection = 'sessions'
  constructor(dbName, url) {
    this.dbName = dbName;
    this.url = url;
  }
  withCollection = (collection, fn) => {
    const self = this;
    return new Promise((res, rej) => {
      MongoClient.connect(this.url)
        .then((client) => {
          const db = client.db(this.dbName);
          const coll = db.collection(collection);
          try {
            fn.call(self, coll)
              .then((d) => {
                const { result, ops, insertedCount, insertedIds } = d;
                res(d);
                client.close();
              })
              .catch((e) => {
                rej(e);
                client.close();
              });
          }
          catch (e) {
            rej(e);
            client.close();
          }
        })
        .catch(e => rej(e));
    });
  }
  sessionExists = sessionId => this.withCollection(
    this.sessionsCollection,
    coll => coll.count({ _id: sessionId }),
  ).then(r => r === 1)

  updateSession = (sessionId, spec) => {

  }
  save = session => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const s = { ...session, _id: session.id };
      return coll.insert(s);
    })
    .then(r => omit(r.ops[0], '_id'));

  addParticipant = (sessionId, newParticipant) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`participants.${newParticipant.name}`] = newParticipant;
      return coll.updateOne(query, spec);
    },
  ).then(r => this.getSession(sessionId));

  removeParticipant = (sessionId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $unset: {
        },
      };
      spec.$unset[`participants.${name}`] = '';
      return coll.updateOne(query, spec);
    },
  ).then(r => this.getSession(sessionId));
  participantDisconnected = (sessionId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`participants.${name}.connected`] = false;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  participantReconnected = (sessionId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`participants.${name}.connected`] = true;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  addResponseType = (sessionId, newResponseType) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`responseTypes.${newResponseType.id}`] = newResponseType;
      return coll.updateOne(query, spec);
    },
  ).then(r => this.getSession(sessionId));

  addResponse = (sessionId, newResponse) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`responses.${newResponse.id}`] = newResponse;
      return coll.updateOne(query, spec);
    },
  ).then(r => this.getSession(sessionId));

  upVoteResponse = (sessionId, responseId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $push: {},
        $inc: {},
      };
      spec.$push[`responses.${responseId}.votes`] = name;
      spec.$inc[`participants.${name}.votes`] = 1;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  cancelUpVoteResponse = (sessionId, responseId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $pull: {},
        $inc: {},
      };
      spec.$pull[`responses.${responseId}.votes`] = name;
      spec.$inc[`participants.${name}.votes`] = -1;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  addFeedback = (sessionId, responseId, message) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: {},
      };
      spec.$set[`responses.${responseId}.flagged`] = true;
      spec.$set[`responses.${responseId}.feedback`] = message;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  setStatus = (sessionId, status) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: { status },
      };
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  getSession = sessionId => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      return coll.findOne(query);
    },
  ).then(r => omit(r, '_id'))
}
export default new MongoDao(process.env.DATABASE_NAME || 'sessions', process.env.MONGODB_URL);
