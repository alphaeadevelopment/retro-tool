/* globals describe, it, before */
/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import sessionManager from './session-manager';

describe('session manager', () => {
  let session;
  let updatedSession;
  let sessionId = 'sessionId';
  let socketId = 'socketId';
  let owner = 'owner';
  before(() => {
    sessionId = 'sessionId';
    socketId = 'socketId';
    owner = 'owner';
    session = sessionManager.createSession(sessionId, socketId, owner);
  });
  it('creates a new session', () => {
    expect(session).to.not.be.null;
    expect(session).to.have.property('id', sessionId);
    expect(session).to.have.property('owner', owner);
    expect(session).to.have.property('participants').deep.equal([]);
    expect(session).to.have.property('responses');
    expect(session.responses).to.have.property('start').deep.equal([]);
    expect(session.responses).to.have.property('continue').deep.equal([]);
    expect(session.responses).to.have.property('change').deep.equal([]);
  });
  describe('join session', () => {
    it('adds participant', () => {
      const name = 'Bob';
      updatedSession = sessionManager.joinSession(socketId, name, sessionId);
      expect(updatedSession).to.have.property('participants').deep.equal([name]);
    });
  });
});
