import merge from 'lodash/merge';

const defaultTextOptions = ({
  body: {
    indent: 20,
    fontSize: 20,
  },
  heading: {
    indent: 10,
    fontSize: 23,
  },
  subheading: {
    indent: 10,
    fontSize: 20,
  },
});

export default (page, text, variant = 'body', options = {}) => {
  const { fontSize, ...other } = defaultTextOptions[variant];
  page.fontSize(fontSize).text(text, merge(other, options));
};
