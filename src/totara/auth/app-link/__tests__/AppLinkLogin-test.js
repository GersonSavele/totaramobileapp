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
  it("valid Url, IP-Address and DeepLink with 'site' and 'setupsecret'", () => {
    const urlHttps = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const actualResultSiteHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "site");
    expect(actualResultSiteHttps).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "setupsecret");
    expect(actualResultSetupsecretHttps).toBe("cavnakd2143df80800");

    const urlHttp = "http://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const actualResultSiteHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "site");
    expect(actualResultSiteHttp).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "setupsecret");
    expect(actualResultSetupsecretHttp).toBe("cavnakd2143df80800");
    
    const deppLink = "totara://register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const actualResultSiteDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "site");
    expect(actualResultSiteDeepLink).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "setupsecret");
    expect(actualResultSetupsecretDeepLink).toBe("cavnakd2143df80800");

    const ipAddress = "http://10.0.8.153/register?site=http://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const actualResultSiteIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "site");
    expect(actualResultSiteIpAddress).toBe("http://mobile.totaralearning.com");
    const actualResultSetupsecretIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "setupsecret");
    expect(actualResultSetupsecretIpAddress).toBe("cavnakd2143df80800");
  });
  it("valid Url, IP-Address and DeepLink ink with only 'site'", () => {
    const urlHttps = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com";
    const actualResultSiteHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "site");
    expect(actualResultSiteHttps).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "setupsecret");
    expect(actualResultSetupsecretHttps).toBeNull();

    const urlHttp = "http://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com";
    const actualResultSiteHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "site");
    expect(actualResultSiteHttp).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "setupsecret");
    expect(actualResultSetupsecretHttp).toBeNull()

    const deppLink = "totara://register?site=https://mobile.totaralearning.com";
    const actualResultSiteDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "site");
    expect(actualResultSiteDeepLink).toBe("https://mobile.totaralearning.com");
    const actualResultSetupsecretDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "setupsecret");
    expect(actualResultSetupsecretDeepLink).toBeNull();

    const ipAddress = "http://10.0.8.153/register?site=http://mobile.totaralearning.com";
    const actualResultSiteIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "site");
    expect(actualResultSiteIpAddress).toBe("http://mobile.totaralearning.com");
    const actualResultSetupsecretIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "setupsecret");
    expect(actualResultSetupsecretIpAddress).toBeNull();
  });
  it("valid Url, IP-Address and DeepLink with only 'setupsecret'", () => {
    const urlHttps = "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800";
    const actualResultSiteHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "site");
    expect(actualResultSiteHttps).toBe(null);
    const actualResultSetupsecretHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "setupsecret");
    expect(actualResultSetupsecretHttps).toBe("cavnakd2143df80800");

    const urlHttp = "http://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800";
    const actualResultSiteHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "site");
    expect(actualResultSiteHttp).toBe(null);
    const actualResultSetupsecretHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "setupsecret");
    expect(actualResultSetupsecretHttp).toBe("cavnakd2143df80800");

    const deppLink = "totara://register?setupsecret=cavnakd2143df80800";
    const actualResultSiteDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "site");
    expect(actualResultSiteDeepLink).toBe(null);
    const actualResultSetupsecretDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "setupsecret");
    expect(actualResultSetupsecretDeepLink).toBe("cavnakd2143df80800");

    const ipAddress = "http://10.0.8.153/register?setupsecret=cavnakd2143df80800";
    const actualResultSiteIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "site");
    expect(actualResultSiteIpAddress).toBeNull();
    const actualResultSetupsecretIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "setupsecret");
    expect(actualResultSetupsecretIpAddress).toBe("cavnakd2143df80800");
  });
  it("valid Url, IP-Address and DeepLink without any query parameter", () => {
    const urlHttps = "https://mobile.totaralearning.com/register";
    const actualResultSiteHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "site");
    expect(actualResultSiteHttps).toBe(null);
    const actualResultSetupsecretHttps = appLinkLogin.getValueForUrlQueryParameter(urlHttps, "setupsecret");
    expect(actualResultSetupsecretHttps).toBe(null);

    const urlHttp = "http://mobile.totaralearning.com/register";
    const actualResultSiteHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "site");
    expect(actualResultSiteHttp).toBe(null);
    const actualResultSetupsecretHttp = appLinkLogin.getValueForUrlQueryParameter(urlHttp, "setupsecret");
    expect(actualResultSetupsecretHttp).toBe(null);

    const deppLink = "totara://register";
    const actualResultSiteDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "site");
    expect(actualResultSiteDeepLink).toBe(null);
    const actualResultSetupsecretDeepLink = appLinkLogin.getValueForUrlQueryParameter(deppLink, "setupsecret");
    expect(actualResultSetupsecretDeepLink).toBe(null);

    const ipAddress = "http://10.0.8.153/register";
    const actualResultSiteIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "site");
    expect(actualResultSiteIpAddress).toBeNull();
    const actualResultSetupsecretIpAddress = appLinkLogin.getValueForUrlQueryParameter(ipAddress, "setupsecret");
    expect(actualResultSetupsecretIpAddress).toBeNull();
  });
});

describe("Action for Auth Universal/AppLink and Deeplink event according to different data", () => {
  it("AppLink and DeepLink with all valid data", () => {
    const url = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const expectData = {
      secret: "cavnakd2143df80800",
      uri: "https://mobile.totaralearning.com"
    };
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).not.toThrowError();
      expect(result).toMatchObject(expectData);
    } catch(e) {
      expect(e).not.toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?site=https://mobile.totaralearning.com&setupsecret=cavnakd2143df80800";
    const expectDataDeepLink = {
      secret: "cavnakd2143df80800",
      uri: "https://mobile.totaralearning.com"
    };
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).not.toThrowError();
      expect(resultDeepLink).toMatchObject(expectDataDeepLink);
    } catch(e) {
      expect(e).not.toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink with only 'uri' data", () => {
    const url = "https://mobile.totaralearning.com/register?site=https://mobile.totaralearning.com";
    const expectData = new Error("Invalid request, 'token' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?site=https://mobile.totaralearning.com";
    const expectDataDeepLink = new Error("Invalid request, 'token' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink with only 'secret' data", () => {
    const url = "https://mobile.totaralearning.com/register?setupsecret=cavnakd2143df80800";
    const expectData = new Error("Invalid request, 'site' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?setupsecret=cavnakd2143df80800";
    const expectDataDeepLink = new Error("Invalid request, 'site' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink without any data", () => {
    const url = "https://mobile.totaralearning.com/register/";
    const expectData = new Error("Invalid request, 'site' and 'token' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register";
    const expectDataDeepLink = new Error("Invalid request, 'site' and 'token' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink with valid 'site' and emplty 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=https://mobile.totaralearning.com&setupsecret=";
    const expectData = new Error("Invalid request, 'token' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?site=https://mobile.totaralearning.com&setupsecret=";
    const expectDataDeepLink = new Error("Invalid request, 'token' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink with empty 'site' and valid 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=&setupsecret=cavnakd2143df80800";
    const expectData = new Error("Invalid request, 'site' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?site=&setupsecret=cavnakd2143df80800";
    const expectDataDeepLink = new Error("Invalid request, 'site' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
  it("AppLink and DeepLink with empty 'site' and 'secret'", () => {
    const url = "https://mobile.totaralearning.com/register/?site=&setupsecret=";
    const expectData = new Error("Invalid request, 'site' and 'token' cannot be null or empty.");
    try {
      const result = appLinkLogin.getDeviceRegisterData(url);
      expect(result).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectData);
    }

    const urlDeepLink = "totara://register?site=&setupsecret=";
    const expectDataDeepLink = new Error("Invalid request, 'site' and 'token' cannot be null or empty.");
    try {
      const resultDeepLink = appLinkLogin.getDeviceRegisterData(urlDeepLink);
      expect(resultDeepLink).toThrowError();
    } catch(e) {
      expect(e).toMatchObject(expectDataDeepLink);
    }
  });
});