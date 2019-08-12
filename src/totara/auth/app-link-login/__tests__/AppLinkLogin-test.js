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
import AppLinkLogin from "../AppLinkLogin";
import renderer from "react-test-renderer";


const mockOnSuccess = jest.fn();
const mockOnFail = jest.fn();

const appLinkLogin = renderer.create(
  <AppLinkLogin onLoginSuccess={mockOnSuccess} onLoginFailure={mockOnFail} />
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
      // it("Test " + testcase + ": 'url'='" + url + "', expect 'site' = '" + expectSite + "' and 'setupsecret' = '" + expectSetupsecret + "'.", () => {
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
  
  function testHandleAppLinkRegister(testCases) {
    for(let i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];
      const url = testCase["url"];
      const expectAction= testCase["result"]["action"];
      const expectData = testCase["result"]["data"];
      const testcase = testCase["testcase"];
      it(testcase, () => {
        appLinkLogin.handleAppLinkRegister(url);
        expect(expectAction).toBeCalledWith(expectData);
      });
    }
  }
  const testCases = [
    {
      "testcase": "AppLink with all valid data",
      "url": "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnSuccess,
        "data": {
          "secret": "cavnakd2143df80800",
          "uri": "https://mobile.totaralearning.com"
        }
      }
    }, {
      "testcase": "AppLink with only 'uri' data",
      "url": "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "AppLink with only 'secret' data",
      "url": "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "AppLink without any data",
      "url": "https://mobile.totaralearning.com/register/",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "AppLink with valid 'site' and emplty 'secret'",
      "url": "https://mobile.totaralearning.com/register/?site=https://mobile.totaralearning.com&setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "AppLink with empty 'site' and valid 'secret'",
      "url": "https://mobile.totaralearning.com/register/?site=setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "AppLink with empty 'site' and 'secret'",
      "url": "https://mobile.totaralearning.com/register/?site=setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink with all valid data",
      "url": "https://10.0.8.153/register?site=https://10.0.8.153&setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnSuccess,
        "data": {
          "secret": "cavnakd2143df80800",
          "uri": "https://10.0.8.153"
        }
      }
    }, {
      "testcase": "IP-Address formatted AppLink with only 'uri' data",
      "url": "https://10.0.8.153/register?site=https://10.0.8.153",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink with only 'secret' data",
      "url": "https://10.0.8.153/register?setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink without any data",
      "url": "https://10.0.8.153/register/",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink with valid 'site' and emplty 'secret'",
      "url": "https://10.0.8.153/register/?site=https://10.0.8.153&setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink with empty 'site' and valid 'secret'",
      "url": "https://10.0.8.153/register/?site=setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "IP-Address formatted AppLink with empty 'site' and 'secret'",
      "url": "https://10.0.8.153/register/?site=setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink with all valid data",
      "url": "totara://register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnSuccess,
        "data": {
          "secret": "cavnakd2143df80800",
          "uri": "https://mobile.totaralearning.com"
        }
      }
    }, {
      "testcase": "DeepLink with only 'uri' data",
      "url": "totara://register?site=https://mobile.totaralearning.com",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink with only 'secret' data",
      "url": "totara://register?setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink without any data",
      "url": "totara://register/",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink with valid 'site' and emplty 'secret'",
      "url": "totara://register/?site=https://mobile.totaralearning.com&setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'token' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink with empty 'site' and valid 'secret'",
      "url": "totara://register/?site=setupsecret=cavnakd2143df80800",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' cannot be null or empty.")
      }
    }, {
      "testcase": "DeepLink with empty 'site' and 'secret'",
      "url": "totara://register/?site=setupsecret=",
      "result": {
        "action": mockOnFail,
        "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
      }
    }
  ];
  testHandleAppLinkRegister(testCases);
});