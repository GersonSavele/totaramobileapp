/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2021 onwards Totara Learning Solutions LTD
 *
 * Totara Enterprise is provided only to Totara Learning Solutions
 * LTD’s customers and partners, pursuant to the terms and
 * conditions of a separate agreement with Totara Learning
 * Solutions LTD or its affiliate.
 *
 * If you do not have an agreement with Totara Learning Solutions
 * LTD, you may not access, use, modify, or distribute this software.
 * Please contact [sales@totaralearning.com] for more information.
 */

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { buildClientSchema } = require("graphql");

const introspectedSchema = require("./schema.json");
const { port, mockServerUrl } = require("./config");

const createServerWithMockedSchema = (customMocks = {}) => {
  const schema = buildClientSchema(introspectedSchema);

  const server = new ApolloServer({
    schema: schema,
    mocks: customMocks,
    playground: {
      endpoint: mockServerUrl
    }
  });
  return server;
};

let graphQLServerApp;
let httpServer;

const startHttpServer = () => {
  return new Promise((resolve) => {
    httpServer = graphQLServerApp.listen(port, () => {
      resolve();
    });
  });
};

const stopHttpServer = () => {
  return new Promise((resolve) => httpServer.close(() => resolve()));
};

const startGraphQLServer = async (mock = {}) => {
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
};

const stopGraphQLServer = async () => {
  if (!httpServer) {
    console.warn("Tried to close null HTTP server.");
    return;
  }

  await stopHttpServer();
  httpServer = null;
  graphQLServerApp = null;
};

module.exports = {
  startGraphQLServer,
  stopGraphQLServer
};
