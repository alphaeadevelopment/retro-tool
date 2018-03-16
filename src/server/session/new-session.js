export default (id, owner) => ({
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
  numParticipants: 1,
  connectedParticipants: 1,
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
