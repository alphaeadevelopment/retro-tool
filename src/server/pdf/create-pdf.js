import PDFDocument from 'pdfkit';
import base64 from 'base64-stream';
import forEach from 'lodash/forEach';
import pickBy from 'lodash/pickBy';
import keys from 'lodash/keys';
import update from 'immutability-helper';

import { sessionInfo, responseType, newPage } from './content';

const sanitiseResponse = r => update(r,
  {
    $unset: ['id', 'author', 'responseType'],
    votes: {
      $apply: v => v.length,
    },
  },
);
const getResponses = (responses, rt) => {
  const responseIds = keys(pickBy(responses, r => r.responseType === rt.id));
  return responseIds.map(id => sanitiseResponse(responses[id]));
};
export default session => new Promise((res, rej) => {
  try {
    console.log('Creating PDF');
    const pdf = new PDFDocument({ autoFirstPage: false });
    const addPage = newPage(pdf);

    sessionInfo(session, addPage());

    forEach(session.responseTypes, (rt) => {
      const responses = getResponses(session.responses, rt);
      responseType(rt, responses, addPage());
    });

    //
    // retroToolResponses.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250)
    //   .fill('#FF3300');

    // retroToolResponses.scale(0.6).translate(470, -380).path('M 250,75 L 323,301 131,161 369,161 177,301 z').fill('red', 'even-odd')
    //   .restore();

    // retroToolResponses.addPage().fillColor('blue').text('Here is a link!', 100, 100).underline(100, 100, 160, 27, {
    //   color: '#0000FF',
    // })
    // .link(100, 100, 160, 27, 'http://google.com/');

    pdf.end();
    const stream = pdf.pipe(base64.encode());
    let finalString = ''; // contains the base64 string
    stream.on('data', (chunk) => {
      finalString += chunk;
    });
    stream.on('end', () => {
      res(finalString);
    });
  }
  catch (e) {
    console.log(e);
    rej(e);
  }
});

