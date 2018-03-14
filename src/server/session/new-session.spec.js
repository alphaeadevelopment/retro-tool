/* globals xdescribe, xit, before describe, it, beforeEach */ // eslint-disable-line no-unused-vars
/* eslint-disable no-unused-expressions,import/no-webpack-loader-syntax */
import { expect } from 'chai';
import generate from 'shortid';
import newSession from './new-session';

describe('newSession', () => {
  it('creates a new session object', () => {
    // assemble
    const sessionId = generate();
    const owner = 'owner';
    // act
    const actual = newSession(sessionId, owner);
    // assert
    expect(actual).to.have.property('id', sessionId);
    expect(actual).to.have.property('owner', owner);
    expect(actual).to.have.property('participants').deep.equal({ [owner]: { name: owner, votes: 0, connected: true } });
    expect(actual).to.have.property('responses');
    expect(actual).to.have.property('responseTypes');
    expect(actual.responseTypes).to.have.property('stop');
    expect(actual.responseTypes.stop).to.have.property('title');
    expect(actual.responseTypes).to.have.property('start');
    expect(actual.responseTypes.start).to.have.property('title');
    expect(actual.responseTypes).to.have.property('continue');
    expect(actual.responseTypes.continue).to.have.property('title');
    expect(actual).to.have.property('status', 'initial');
  });
});
