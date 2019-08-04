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


describe("Method getValueForUrlQueryParameter => (url: string, key: string), which is used to read the value of parameter 'key' in query string from valid non-encoded 'url' with protocols of (http://, https:// and totara://)", () => {

  function testGetValueForUrlQueryParameter(testCases) {
    const keySite = "site";
    const keySetupsecret = "setupsecret";

    for (let i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];
      const expectSite = testCase["site"];
      const expectSetupsecret = testCase["setupsecret"];
      const url = testCase["url"];
      const testcase = testCase["testcase"];
      it("Test " + testcase + ": 'url'='" + url + "', expect 'site' = '" + expectSite + "' and 'setupsecret' = '" + expectSetupsecret + "'.", () => {
        const actualResultSite = appLinkLogin.getValueForUrlQueryParameter(url, keySite);
        expect(actualResultSite).toBe(expectSite);

        const actualResultSetupsecret = appLinkLogin.getValueForUrlQueryParameter(url, keySetupsecret);
        expect(actualResultSetupsecret).toBe(expectSetupsecret);
      });
    }
  }

  describe("Passing different forms of valid 'url', expect to return values of query string parameter 'key'.", () => {
    const testCases = [
      {
        "testcase": "01",
        "url": "https://totaralearning.com?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "02",
        "url": "https://totaralearning.com?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "03",
        "url": "https://totaralearning.com?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "04",
        "url": "https://totaralearning.com",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "05",
        "url": "https://totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "06",
        "url": "https://totaralearning.com/register?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "07",
        "url": "https://totaralearning.com/register?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "08",
        "url": "https://totaralearning.com/register",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "09",
        "url": "https://totaralearning.com/register/?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "10",
        "url": "https://totaralearning.com/register/?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "11",
        "url": "https://totaralearning.com/register/?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "12",
        "url": "https://totaralearning.com/register/",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "13",
        "url": "https://totaralearning.com/register?site=&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": ""
      }, {
        "testcase": "14",
        "url": "https://totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=",
        "setupsecret": "",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "15",
        "url": "https://totaralearning.com/register?site=&setupsecret=",
        "setupsecret": "",
        "site": ""
      }, {
        "testcase": "16",
        "url": "https://totaralearning.com/register?site&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "17",
        "url": "https://totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "18",
        "url": "https://totaralearning.com?site&setupsecret",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "19",
        "url": "http://totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "20",
        "url": "http://totaralearning.com/register?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "21",
        "url": "http://totaralearning.com/register?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "22",
        "url": "http://totaralearning.com/register",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "23",
        "url": "http://totaralearning.com/register?site=&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": ""
      }, {
        "testcase": "24",
        "url": "http://totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=",
        "setupsecret": "",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "25",
        "url": "https://10.0.8.153/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "26",
        "url": "https://10.0.8.153/register?site=https://192.30.200.23&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://192.30.200.23"
      }, {
        "testcase": "27",
        "url": "https://10.0.8.153/register?site=&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": ""
      }, {
        "testcase": "28",
        "url": "https://10.0.8.153/register?site=https://mobile.totaralearning.com&setupsecret=",
        "setupsecret": "",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "29",
        "url": "https://10.0.8.153/register?site&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "30",
        "url": "https://10.0.8.153/register?site=https://mobile.totaralearning.com&setupsecret",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "31",
        "url": "http://10.0.8.153/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "32",
        "url": "http://10.0.8.153/register?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "33",
        "url": "http://10.0.8.153/register?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "34",
        "url": "http://10.0.8.153/register",
        "setupsecret": null,
        "site": null
      }, {
        "testcase": "35",
        "url": "http://10.0.8.153/register?site=&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": ""
      }, {
        "testcase": "36",
        "url": "http://10.0.8.153/register?site=https://mobile.totaralearning.com&setupsecret=",
        "setupsecret": "",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "37",
        "url": "totara://register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "38",
        "url": "totara://register?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "39",
        "url": "totara://register?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "40",
        "url": "totara://register",
        "setupsecret": null,
        "site": null
      },  {
        "testcase": "41",
        "url": "totara://register/?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "42",
        "url": "totara://register/?site=https://mobile.totaralearning.com",
        "setupsecret": null,
        "site": "https://mobile.totaralearning.com"
      }, {
        "testcase": "43",
        "url": "totara://register/?setupsecret=cavnakd2143df80800",
        "setupsecret": "cavnakd2143df80800",
        "site": null
      }, {
        "testcase": "44",
        "url": "totara://register/",
        "setupsecret": null,
        "site": null
      }
    ];
    testGetValueForUrlQueryParameter(testCases);
  });

});

describe("Method handleAppLinkRegister => (url: string), which is used to handle deep linking, app linking and universal linking for the user remote-login, which called only 'totara://register', 'http://mobile.totaralearning.com/register' and 'https://mobile.totaralearning.com/register' patterned url with '/register' or '/register/' endpoints (ex: https://mobile.totaralearning.com/register?site=xxxxxx&setupsecret=xxxxx).", () => {
  
  function testHandleAppLinkRegister(testCases) {
    for(let i = 0; i < testCases.length; i++) {
      var testCase = testCases[i];
      const url = testCase["url"];
      const expectAction= testCase["result"]["action"];
      const expectData = testCase["result"]["data"];
      const caseNumber = testCase["testcase"];
      const expectActionName = ((expectAction == mockOnSuccess) ? "onLoginSuccess" : ((expectAction == mockOnFail) ? "onLoginFailure" : "unknown"));
      const expectActionData = ((expectAction == mockOnSuccess) ? JSON.stringify(expectData) : ((expectAction == mockOnFail) ? expectData : "unknown"));
      it("Test "+caseNumber+": 'url'='"+url+"', expect to call "+expectActionName+"("+expectActionData+").", () => {
        // expect(mockOnSuccess).toBeCalled();
        appLinkLogin.handleAppLinkRegister(url, appLinkLogin);
        expect(expectAction).toBeCalledWith(expectData);
        
      });
    }
  }
  describe("Expect to call 'onLoginSuccess({uri: value_site, secret: value_setupsecret}) for non-empty or not-null values for the parameter named 'setupsecret' and 'site' or else call 'onLoginFailure(Error: error message)", () => {
    const testCases = [
      {
        "testcase": "01",
        "url": "https://mobile.totaralearning.com/register/?site=https://totaralearning.com&setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnSuccess,
          "data": {
            "secret": "cavnakd2143df80800",
            "uri": "https://totaralearning.com"
          }
        }
      }, {
        "testcase": "02",
        "url": "https://mobile.totaralearning.com/register/?site=https://totaralearning.com",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "03",
        "url": "https://mobile.totaralearning.com/register/?setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "04",
        "url": "https://mobile.totaralearning.com/register/",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "05",
        "url": "https://mobile.totaralearning.com/register/?site=https://totaralearning.com&setupsecret=",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "06",
        "url": "https://mobile.totaralearning.com/register/?site=setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      },  {
        "testcase": "07",
        "url": "https://mobile.totaralearning.com/register?site=https://totaralearning.com&setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnSuccess,
          "data": {
            "secret": "cavnakd2143df80800",
            "uri": "https://totaralearning.com"
          }
        }
      }, {
        "testcase": "08",
        "url": "https://mobile.totaralearning.com/register?site=https://totaralearning.com",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "09",
        "url": "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "10",
        "url": "https://mobile.totaralearning.com/register",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "11",
        "url": "https://mobile.totaralearning.com/register?site=https://totaralearning.com&setupsecret=",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "12",
        "url": "https://mobile.totaralearning.com/register?site=setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "13",
        "url": "http://mobile.totaralearning.com/register?site=https://totaralearning.com&setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnSuccess,
          "data": {
            "secret": "cavnakd2143df80800",
            "uri": "https://totaralearning.com"
          }
        }
      }, {
        "testcase": "14",
        "url": "http://mobile.totaralearning.com/register?site=https://totaralearning.com",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "15",
        "url": "http://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "16",
        "url": "http://mobile.totaralearning.com/register",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "17",
        "url": "http://mobile.totaralearning.com/register?site=https://totaralearning.com&setupsecret=",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "18",
        "url": "http://mobile.totaralearning.com/register?site=setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "19",
        "url": "totara://register?site=https://totaralearning.com&setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnSuccess,
          "data": {
            "secret": "cavnakd2143df80800",
            "uri": "https://totaralearning.com"
          }
        }
      }, {
        "testcase": "20",
        "url": "totara://register?site=https://totaralearning.com",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "21",
        "url": "totara://register?setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      }, {
        "testcase": "22",
        "url": "totara://register",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' and 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "23",
        "url": "totara://register?site=https://totaralearning.com&setupsecret=",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'token' cannot be null or empty.")
        }
      }, {
        "testcase": "24",
        "url": "totara://register?site=setupsecret=cavnakd2143df80800",
        "result": {
          "action": mockOnFail,
          "data": new Error("Invalid request, 'site' cannot be null or empty.")
        }
      },
    ];
    testHandleAppLinkRegister(testCases);
  });
});