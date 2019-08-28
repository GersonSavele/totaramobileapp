/**
 * This file is part of Totara Mobile
 *
 * Copyright (C) 2019 onwards Totara Learning Solutions LTD
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com
 */

import { MockedProvider } from "react-apollo/test-utils";
import renderer from "react-test-renderer";
import React from "react";
import wait from "waait";
import { Text } from "react-native";

import { QueryMe } from "../api";
import AdditionalActionRule from "../AdditionalActionRule";

const response = {
  me: {
    user: {
      id: 1,
      firstname: "Admin",
      lastname: "User",
      fullname: "User fullname",
      email: "admin@totara.com"
    },
    system: {
      wwwroot: "http://10.0.8.127/",
      apiurl: "http://10.0.8.127/totara/mobile/api.php",
      release: "Evergreen (Build: 20190619.00)",
      request_policy_agreement: false,
      request_user_consent: false,
      request_user_fields: true
    },
    enrolled_courses: {
      id: 1,
      fullname: "User",
      shortname: "Usr",
      idnumber: 1
    }
  }
};

const mocks = [
  {
    request: {
      query: QueryMe
    },
    result: {
      data: response
    }
  }
];

const mocksError = [
  {
    request: {
      query: QueryMe
    },
    error: new Error("Error")
  }
];

describe("should render loading state initially", () => {
  it("Test result : return Loading...", () => {
    const component = renderer.create(
      <MockedProvider mocks={[]} addTypename={false}>
        <AdditionalActionRule></AdditionalActionRule>
      </MockedProvider>
    );
    const tree = component.toJSON();
    expect(tree.children).toContain("Loading...");
  });
});

describe("should render additional action rule", () => {
  it("Test result : After render additional action rule, it will return child component", async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdditionalActionRule>
          <Text>Modal Details</Text>
        </AdditionalActionRule>
      </MockedProvider>
    );
    await wait(0); // wait for response
    const tree = component.root.props.children.props.children.props.children;
    expect(tree).toContain("Modal Details");
  });
});

describe("should show error UI", () => {
  it("Test result : return Error", async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocksError} addTypename={false}>
        <AdditionalActionRule />
      </MockedProvider>
    );
    await wait(0); // wait for response
    const tree = component.toJSON();
    expect(tree.children).toContain("Error!");
  });
});
