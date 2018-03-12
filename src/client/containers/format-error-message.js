const messageMap = {
  'applicationError': 'You are already active in another session',
  'name in use': 'That name is already taken by another user',
  'no such session': 'Unknown session',
};

export default ({ message }) => {
  const formatted = messageMap[message];
  return formatted || message;
};
