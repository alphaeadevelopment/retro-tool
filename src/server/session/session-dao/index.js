/* eslint-disable global-require, import/no-mutable-exports */
let dao;

if (process.env.DAO === 'mongo') {
  dao = require('./mongo-dao').default;
}
else {
  dao = require('./in-memory-dao').default;
}

export default dao;
