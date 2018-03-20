import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
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
    pdf.registerFont('Roboto', fs.readFileSync(path.join(__dirname, './roboto-latin-300.a1471d1d.woff')));
    pdf.font('Roboto');
    const addPage = newPage(pdf);

    sessionInfo(session, addPage());

    forEach(session.responseTypes, (rt) => {
      const responses = getResponses(session.responses, rt);
      responseType(rt, responses, addPage());
    });

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

