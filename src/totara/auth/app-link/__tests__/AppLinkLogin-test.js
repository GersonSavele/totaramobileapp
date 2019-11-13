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
 * @author: Kamala Tennakoon <kamala.tennakoon@totaralearning.com>
 */

import React from 'react';
import AppLinkFlow from "../AppLinkFlow";
import renderer from "react-test-renderer";


const mockOnSuccess = jest.fn();
const mockOnFail = jest.fn();

const appLinkLogin = renderer.create(
  <AppLinkFlow onLoginSuccess={mockOnSuccess} onLoginFailure={mockOnFail} />
).getInstance();

describe("Passing different forms of 'url' and get the value for query string parameters('site' and 'setupsecret')", () => {
  function testGetValueForUrlQueryParameter(testCases) {
    const keySite = "site";
    const keySetupsecret = "setupsecret";

    for (let i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];
      const expectSite = testCase["site"];
      const expectSetupsecret = testCase["setupsecret"];
      const url = testCase["url"];
      const testcase = testCase["testcase"];
      it( testcase, () => {
        const actualResultSite = appLinkLogin.getValueForUrlQueryParameter(url, keySite);
        expect(actualResultSite).toBe(expectSite);

        const actualResultSetupsecret = appLinkLogin.getValueForUrlQueryParameter(url, keySetupsecret);
        expect(actualResultSetupsecret).toBe(expectSetupsecret);
      });
    }
  }
  const testCases = [
    {
      "testcase": "https valid general url with 'site' and 'setupsecret'",
      "url": "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": "https://mobile.totaralearning.com"
    }, {
      "testcase": "https valid general url with only 'site'",
      "url": "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com",
      "setupsecret": null,
      "site": "https://mobile.totaralearning.com"
    }, {
      "testcase": "https valid general url with only 'setupsecret'",
      "url": "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": null
    }, {
      "testcase": "https valid general url without any query parameter",
      "url": "https://mobile.totaralearning.com/register",
      "setupsecret": null,
      "site": null
    }, {
      "testcase": "http valid general url with 'site' and 'setupsecret'",
      "url": "http://mobile.totaralearning.com/register?site=http://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "http valid general url with only 'site'",
      "url": "http://mobile.totaralearning.com/register?site=http://mobile.totaralearning.com",
      "setupsecret": null,
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "http valid general url with only 'setupsecret'",
      "url": "http://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": null
    }, {
      "testcase": "http valid general url without any query parameter",
      "url": "http://mobile.totaralearning.com/register",
      "setupsecret": null,
      "site": null
    }, {
      "testcase": "deeplink url with 'site' and 'setupsecret'",
      "url": "totara://register?site=http://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "deeplink url with only 'site'",
      "url": "totara://register?site=http://mobile.totaralearning.com",
      "setupsecret": null,
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "deeplink url with only 'setupsecret'",
      "url": "totara://register?setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": null
    }, {
      "testcase": "deeplink url without any query parameter",
      "url": "totara://register",
      "setupsecret": null,
      "site": null
    }, {
      "testcase": "Valid ip-address formatted url with 'site' and 'setupsecret'",
      "url": "http://10.0.8.153/register?site=http://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "Valid ip-address formatted url with only 'site'",
      "url": "http://10.0.8.153/register?site=http://mobile.totaralearning.com",
      "setupsecret": null,
      "site": "http://mobile.totaralearning.com"
    }, {
      "testcase": "Valid ip-address formatted url with only 'setupsecret'",
      "url": "http://10.0.8.153/register?setupsecret=cavnakd2143df80800",
      "setupsecret": "cavnakd2143df80800",
      "site": null
    }, {
      "testcase": "Valid ip-address formatted url without any query parameter",
      "url": "http://10.0.8.153/register",
      "setupsecret": null,
      "site": null
    }
  ];
  testGetValueForUrlQueryParameter(testCases);
});

describe("Action for Auth Universal/AppLink and Deeplink event according to different data", () => {
  it("AppLink with all valid data", () => {
    const url = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: true,
      data: {
        "secret": "cavnakd2143df80800",
        "uri": "https://mobile.totaralearning.com"
      }
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeTruthy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink with only 'uri' data", () => {
    const url = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink with only 'secret' data", () => {
    const url = "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink without any data", () => {
    const url = "https://mobile.totaralearning.com/register/";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink with valid 'site' and emplty 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=https://mobile.totaralearning.com&setupsecret=";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink with empty 'site' and valid 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=&setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("AppLink with empty 'site' and 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=&setupsecret=";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with all valid data", () => {
    const url = "totara://register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: true,
      data: {
        secret: "cavnakd2143df80800",
        uri: "https://mobile.totaralearning.com"
      }
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeTruthy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with only 'uri' data", () => {
    const url = "totara://register?site=https://mobile.totaralearning.com";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with only 'secret' data", () => {
    const url = "totara://register?setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink without any data", () => {
    const url = "totara://register/";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with valid 'site' and emplty 'secret'", () => {
    const url = "totara://register/?site=https://mobile.totaralearning.com&setupsecret=";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with empty 'site' and valid 'secret'", () => {
    const url = "totara://register/?site=&setupsecret=cavnakd2143df80800";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
  it("DeepLink with empty 'site' and 'secret'", () => {
    const url = "totara://register/?site=&setupsecret=";
    const expectData = {
      valid: false,
      data: new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
    };
    const result = appLinkLogin.getDeviceRegisterData(url);
    expect(result.valid).toBeFalsy();
    expect(result.data).toMatchObject(expectData.data);
  });
});