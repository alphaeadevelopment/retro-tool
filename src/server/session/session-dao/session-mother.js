
const now = Date.now();

export const fakeSession = (id, owner) => ({
  id,
  status: 'initial',
  participants: {
    [owner]: {
      name: owner,
      votes: 0,
      connected: true,
      joinedAt: now,
    },
    participant1: {
      name: 'participant1',
      votes: 0,
      connected: true,
      joinedAt: now + 200,
    },
    participant2: {
      name: 'participant2',
      votes: 0,
      connected: true,
      joinedAt: now + 100,
    },
  },
  numParticipants: 3,
  connectedParticipants: 3,
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
