/* eslint-disable */
const fs = require('fs');
const path = require('path')
const moduleConfig = require(
  fs.existsSync(path.join(__dirname, '../../config/module-config.js')) ?
    '../../config/module-config' :
    '../../config/default-module-config.js'
);
const alias = moduleConfig.aliases;

console.log('aliases: %o', alias);

require('babel-register')({ // eslint-disable-line import/no-extraneous-dependencies
  'plugins': [
    ['module-resolver', {
      'root': ['.'],
      'alias': alias,
    }],
  ],
});
