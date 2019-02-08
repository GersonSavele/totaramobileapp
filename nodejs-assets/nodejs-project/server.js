'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _graphqlServerExpress = require('graphql-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _schema = require('./schema');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = 4000;

var server = (0, _express2.default)();

server.use('*', (0, _cors2.default)({ origin: 'http://localhost:3000' }));

server.use('/graphql', _bodyParser2.default.json(), (0, _graphqlServerExpress.graphqlExpress)({
    schema: _schema.schema
}));

server.use('/graphiql', (0, _graphqlServerExpress.graphiqlExpress)({
    endpointURL: '/graphql'
}));

server.use('/public', _express2.default.static(_path2.default.join(__dirname, 'src/public')));

server.listen(PORT, function () {
    return console.log('GraphQL Server is now running on http://localhost:' + PORT);
});

