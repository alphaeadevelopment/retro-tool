import values from 'lodash/values';

export default (session, page) => {
  page.fontSize(25).text(`Session created by ${session.owner}`);
  page.moveDown();
  page.text('Participants:').fontSize(20).moveDown();
  page.list(values(session.participants).map(p => p.name), { indent: 20, textIndent: 30, bulletIndent: 50, bulletRadius: 4 });
};
