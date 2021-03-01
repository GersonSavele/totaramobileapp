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
const { port } = require("./config");
const graphqlApiPath = "/totara/mobile/api.php";

const createServerWithMockedSchema = (customMocks = {}) => {
  const schema = buildClientSchema(introspectedSchema);

  const server = new ApolloServer({
    schema: schema,
    mocks: customMocks
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
    console.warn("Tried to stop running server.");
    await stopGraphQLServer();
  }
  graphQLServerApp = express();
  const server = createServerWithMockedSchema(mock);
  graphQLServerApp.use("/totara/mobile/api.php", express.json());
  graphQLServerApp.post("/totara/mobile/site_info.php", (req, res) => {
    res.json({
      data: {
        app_version: "1.0.7",
        auth: "native",
        siteMaintenance: "0",
        theme: {
          urlLogo: "https://mobile.demo.totara.software/pluginfile.php/1/totara_mobile/logo/0/App%20logo.png",
          colorPrimary: "#1c5a94",
          colorText: "#FFFFFF"
        },
        version: "2020100100"
      }
    });
  });
  graphQLServerApp.get("/totara/mobile/login_setup.php", (req, res) => {
    res.json({ data: { loginsecret: "mock_login_secret" } });
  });
  graphQLServerApp.post("/totara/mobile/login.php", (req, res) => {
    res.json({
      data: {
        setupsecret: "mock_setup_secret"
      }
    });
  });
  graphQLServerApp.post("/totara/mobile/device_register.php", function (req, res) {
    res.json({
      data: {
        apikey: "mock_apikey",
        apiurl: "http://127.0.0.1:8089/totara/mobile/api.php",
        version: "2020100100"
      }
    });
  });
  server.applyMiddleware({
    app: graphQLServerApp,
    path: graphqlApiPath
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
