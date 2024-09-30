/**
 * This file is part of Totara Enterprise.
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
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
/** @type {import('jest').Config} */

const config = {
    verbose: true,
    preset: "jest-expo",
    moduleNameMapper: {
        "\\.(jpg|jpeg|png)$": "<rootDir>/src/__mocks__/fileMock.js",
        "^./config.local$":  "<rootDir>/src/__mocks__/configMock.js",
        "@totara/(.*)": "<rootDir>/src/totara/$1",
        "@resources/(.*)": "<rootDir>/src/resources/$1"
      },
    setupFiles: ["<rootDir>/jest.setup.js"],
    testPathIgnorePatterns: ["e2e"],
  };
  
  module.exports = config;
