const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const { buildClientSchema } = require("graphql");
const introspectedSchema = require("./schema.json");
const { resolvers, typeDefs } = require("./resolvers");
const PORT = 8089;

function createServerWithMockedSchema(customMocks = {}) {
  const schema = buildClientSchema(introspectedSchema);

  const server = new ApolloServer({
    schema: schema,
    // typeDefs,
    mocks: customMocks,
    playground: {
      endpoint: `http://localhost:${PORT}/graphql`
    },
    resolvers: resolvers
  });
  return server;
}

let graphQLServerApp;
let httpServer;

function startHttpServer() {
  return new Promise((resolve) => {
    httpServer = graphQLServerApp.listen(PORT, () => {
      resolve();
    });
  });
}

function stopHttpServer() {
  return new Promise((resolve) => httpServer.close(() => resolve()));
}

async function startGraphQLServer(mock = {}) {
  if (httpServer) {
    console.warn("Tried to start HTTP server, when there's already one.");
    return;
  }

  graphQLServerApp = express();
  const server = createServerWithMockedSchema(mock);

  server.applyMiddleware({
    app: graphQLServerApp
  });

  await startHttpServer();
}

async function stopGraphQLServer() {
  if (!httpServer) {
    console.warn("Tried to close null HTTP server.");
    return;
  }

  await stopHttpServer();
  httpServer = null;
  graphQLServerApp = null;
}

module.exports = {
  startGraphQLServer,
  stopGraphQLServer
};
