/* eslint-disable no-unused-vars */
import { MongoClient } from 'mongodb';
import omit from 'lodash/omit';

const returnSession = s => omit(s, ['_id', 'pdfData']);
class MongoDao {
  sessionsCollection = 'sessions'
  socketsCollection = 'sockets'
  sequencesCollection = 'sequences'
  constructor(dbName, url) {
    console.info('Creating Mongo DAO %s at %s', dbName, url);
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

  next = sequenceName => this.withCollection(
    this.sequencesCollection,
    (coll) => {
      const filter = { name: sequenceName };
      const update = { $inc: { value: 1 } };

      return coll.findOneAndUpdate(filter, update, {
        projection: { value: 1 },
        upsert: true,
      });
    })
    .then(r => r.value.value);

  save = session => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const s = { ...session, _id: session.id };
      return coll.insert(s);
    })
    .then(r => returnSession(r.ops[0]));

  addParticipant = (sessionId, newParticipant) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $set: {},
        $inc: {
          numParticipants: 1,
          connectedParticipants: 1,
        },
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
        $inc: {
          numParticipants: -1,
          connectedParticipants: -1,
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
        $inc: {
          connectedParticipants: -1,
        },
      };
      spec.$set[`participants.${name}.connected`] = false;
      return coll.updateOne(query, spec);
    },
  ).then(() => this.getSession(sessionId));

  resetAllConnections = () => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = {};
      const spec = {
        $set: { connectedParticipants: 0 },
      };
      return coll.updateMany(query, spec);
    },
  );

  participantReconnected = (sessionId, name) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: {},
        $inc: {
          connectedParticipants: 1,
        },
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

  deleteResponse = (sessionId, responseId) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $unset: {},
      };
      spec.$unset[`responses.${responseId}`] = '';
      return coll.updateOne(query, spec);
    },
  ).then(r => this.getSession(sessionId));

  deleteResponseType = (sessionId, responseTypeId) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      const spec = {
        $unset: {},
      };
      spec.$unset[`responseTypes.${responseTypeId}`] = '';
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

  getSession = sessionId => this.__getSession(sessionId) // eslint-disable-line no-underscore-dangle
    .then(r => returnSession(r))

  __getSession = sessionId => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { _id: sessionId };
      return coll.findOne(query);
    },
  )

  savePdfData = (sessionId, data) => this.withCollection(
    this.sessionsCollection,
    (coll) => {
      const query = { '_id': sessionId };
      const spec = {
        $set: { pdfData: data },
      };
      return coll.updateOne(query, spec);
    },
  ).then(r => null)

  getPdfData = (sessionId, data) => this.__getSession(sessionId) // eslint-disable-line no-underscore-dangle
    .then(r => r.pdfData)

  registerSocket = (socketId, name, sessionId, token) => this.withCollection(
    this.socketsCollection,
    coll => coll.insert({ _id: socketId, name, sessionId, token }))
    .then(r => omit(r.ops[0], '_id'));

  deregisterSocket = socketId => this.withCollection(
    this.socketsCollection,
    coll => coll.deleteOne({ _id: socketId }))
    .then(r => null);

  isSocketRegistered = socketId => this.withCollection(
    this.socketsCollection,
    (coll) => {
      const query = { _id: socketId };
      return coll.count(query);
    })
    .then(r => r === 1);

  getConnection = socketId => this.withCollection(
    this.socketsCollection,
    (coll) => {
      const query = { _id: socketId };
      return coll.findOne(query);
    })
    .then(r => r);

  getConnectionByToken = token => this.withCollection(
    this.socketsCollection,
    (coll) => {
      const query = { token };
      return coll.findOne(query);
    })
    .then(r =>
      r && { ...omit(r, '_id'), socketId: r._id }, // eslint-disable-line no-underscore-dangle
    );
}
export default new MongoDao(process.env.DATABASE_NAME || 'sessions', process.env.MONGODB_URL);
