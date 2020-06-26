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
 * @author Tharaka Dushmantha <tharaka.dushmantha@totaralearning.com>
 */

import { MockedProvider } from "@apollo/react-testing";
import renderer from "react-test-renderer";
import React from "react";
import wait from "waait";
import { Text } from "react-native";

import { QueryMe } from "../api";
import {
  AdditionalActionRule,
  AdditionalActionRuleCondition
} from "../AdditionalActionRule";
import { act } from "@testing-library/react-native";

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

describe("AdditionalActionRule, Apollo MockedProvider should test three state such as loading, final and error ", () => {
  it("Test result : Render loading state initially and return no component", () => {
    const component = renderer.create(
      <MockedProvider mocks={[]} addTypename={false}>
        <AdditionalActionRule />
      </MockedProvider>
    );
    const tree = component.toJSON();
    expect(tree).toBeNull();
  });

  it("Test result : Once render additional action rule, it will return child component", async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <AdditionalActionRule>
          <Text>Modal Details</Text>
        </AdditionalActionRule>
      </MockedProvider>
    );

    await act(async () => {
      await wait(0);
    });
    const tree = component.root.props.children.props.children.props.children;
    expect(tree).toContain("Modal Details");
  });

  it("Test result : Set mock-error response and return Error UI", async () => {
    const component = renderer.create(
      <MockedProvider mocks={mocksError} addTypename={false}>
        <AdditionalActionRule />
      </MockedProvider>
    );
    await act(async () => {
      await wait(0);
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("AdditionalActionRuleCondition, Passing different bool params which relate policyAgreement,userConsent,userFields and get a bool value", () => {
  it("It should return true for any of passing booleans are true, and return false for all the passing values are false", () => {
    let actualResultSingle = AdditionalActionRuleCondition(
      true,
      false,
      false,
      false
    );
    expect(actualResultSingle).toBe(true);

    actualResultSingle = AdditionalActionRuleCondition(
      false,
      true,
      false,
      false
    );
    expect(actualResultSingle).toBe(true);

    actualResultSingle = AdditionalActionRuleCondition(
      false,
      false,
      true,
      false
    );
    expect(actualResultSingle).toBe(true);

    actualResultSingle = AdditionalActionRuleCondition(
      false,
      false,
      false,
      true
    );
    expect(actualResultSingle).toBe(true);

    let actualResultDouble = AdditionalActionRuleCondition(
      true,
      true,
      false,
      false
    );
    expect(actualResultDouble).toBe(true);

    actualResultDouble = AdditionalActionRuleCondition(
      true,
      false,
      true,
      false
    );
    expect(actualResultDouble).toBe(true);

    actualResultDouble = AdditionalActionRuleCondition(
      true,
      false,
      false,
      true
    );
    expect(actualResultDouble).toBe(true);

    actualResultDouble = AdditionalActionRuleCondition(
      false,
      true,
      true,
      false
    );
    expect(actualResultDouble).toBe(true);

    actualResultDouble = AdditionalActionRuleCondition(
      false,
      true,
      false,
      true
    );
    expect(actualResultDouble).toBe(true);

    actualResultDouble = AdditionalActionRuleCondition(
      false,
      false,
      true,
      true
    );
    expect(actualResultDouble).toBe(true);

    let actualResultThribble = AdditionalActionRuleCondition(
      true,
      true,
      true,
      false
    );
    expect(actualResultThribble).toBe(true);

    actualResultThribble = AdditionalActionRuleCondition(
      true,
      true,
      false,
      true
    );
    expect(actualResultThribble).toBe(true);

    actualResultThribble = AdditionalActionRuleCondition(
      true,
      false,
      true,
      true
    );
    expect(actualResultThribble).toBe(true);

    actualResultThribble = AdditionalActionRuleCondition(
      false,
      true,
      true,
      true
    );
    expect(actualResultThribble).toBe(true);

    const actualResultAll = AdditionalActionRuleCondition(
      true,
      true,
      true,
      true
    );
    expect(actualResultAll).toBe(true);

    const actualResultNone = AdditionalActionRuleCondition(
      false,
      false,
      false,
      false
    );
    expect(actualResultNone).toBe(false);
  });
});
