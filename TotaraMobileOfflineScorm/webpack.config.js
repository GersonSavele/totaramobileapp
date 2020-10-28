const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './SCORM-API-1-2.js'),
  mode: process.env.NODE_ENV || 'development',
  output: {
    filename: 'scorm_12.bundle.js',
    path: path.resolve(__dirname, 'html'),

    // exports 'SCORMapi1_2' as a global
    library: 'SCORMapi1_2',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
};
