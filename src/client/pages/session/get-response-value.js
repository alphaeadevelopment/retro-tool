export default (v) => {
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'string' && v === 'true') {
    return 'Yes';
  }
  else if (typeof v === 'string' && v === 'false') {
    return 'No';
  }
  else if (typeof v === 'number') {
    return v;
  }
  return v;
};
