'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _apolloServer = require('apollo-server');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apolloServer = new _apolloServer.ApolloServer({
  typeDefs: _schema.typeDefs,
  resolvers: _schema.resolvers
});

apolloServer.listen().then(function (_ref) {
  var url = _ref.url;

  console.log('\uD83D\uDE80 Server ready at ' + url);
});

var expressServer = (0, _express2.default)();
expressServer.use('/public', _express2.default.static(_path2.default.join(__dirname, 'src/public')));
//expressServer.use('/public', express.static('src/public'))

var EXPRESS_PORT = 4001;
expressServer.listen(EXPRESS_PORT, function () {
  return console.log('Express Server is now running on http://localhost:' + EXPRESS_PORT);
});

