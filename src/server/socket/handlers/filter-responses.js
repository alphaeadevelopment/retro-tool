export default session => ({
  ...session,
  responses: (session.status === 'initial') ? {} : session.responses,
});
