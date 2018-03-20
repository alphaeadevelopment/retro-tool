import merge from 'lodash/merge';
import isArray from 'lodash/isArray';

const defaultTextOptions = ({
  body: {
    indent: 30,
    fontSize: 20,
    lineGap: 10,
  },
  heading: {
    indent: 10,
    fontSize: 23,
    lineGap: 15,
  },
  subheading: {
    indent: 10,
    fontSize: 20,
    lineGap: 18,
  },
});

const listOptions = { textIndent: 30, bulletIndent: 50, bulletRadius: 4 };

export default (page, text, variant = 'body', options = {}) => {
  const { fontSize, ...other } = defaultTextOptions[variant];
  const opts = merge(other, options);
  if (isArray(text)) {
    page.fontSize(fontSize).list(text, merge(listOptions, opts));
  }
  else if (typeof text === 'string') {
    page.fontSize(fontSize).text(text, opts);
  }
  else {
    page.fontSize(fontSize).text(JSON.stringify(text, null, 2), opts);
  }
  return page;
};
