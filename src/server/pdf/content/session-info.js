import values from 'lodash/values';
import addText from './add-text';

export default (session, page) => {
  addText(page, `Session created by ${session.owner}`, 'heading').moveDown();
  addText(page, 'Participants', 'subheading');
  addText(page, values(session.participants).map(p => p.name), 'body');
};
